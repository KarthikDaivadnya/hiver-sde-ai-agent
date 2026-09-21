from src.escalation.policy import (
    decide_escalation,
)

from src.generation.prompts import (
    build_generation_prompt,
)

from src.generation.grounding import (
    detect_unsupported_action_claims,
)

from .result import AgentResult


class SupportAgent:

    def __init__(
        self,
        classifier,
        retriever,
        generator,
    ):

        self.classifier = classifier
        self.retriever = retriever
        self.generator = generator

    def analyze(
        self,
        query,
    ):

        # --------------------------------
        # 1. Intent classification
        # --------------------------------

        prediction = (
            self.classifier
            .predict(query)
        )

        # --------------------------------
        # 2. Historical retrieval
        # --------------------------------

        evidence = (
            self.retriever
            .retrieve(
                query,
                top_k=3,
                candidate_k=10,
            )
        )

        retrieval_score = (
            evidence[0]["score"]
            if evidence
            else None
        )

        evidence_text = "\n".join(
            item.get(
                "conversation_text",
                "",
            )
            for item in evidence
        )

        # --------------------------------
        # 3. Explicit escalation policy
        # --------------------------------

        decision = decide_escalation(
            intent=prediction["intent"],
            retrieval_score=retrieval_score,
            retrieved_resolution_text=evidence_text,
            customer_text=query,
        )

        # --------------------------------
        # 4. Grounded generation
        # --------------------------------

        prompt = build_generation_prompt(
            customer_context=query,
            intent=prediction["intent"],
            decision=decision.decision,
            decision_reason=decision.reason,
            evidence=evidence,
        )

        generated = (
            self.generator
            .generate(prompt)
        )

        response = generated["text"]

        # --------------------------------
        # 5. Grounding guard
        # --------------------------------

        grounding_flags = (
            detect_unsupported_action_claims(
                response
            )
        )

        # If the generated response contains an unsupported
        # operational action claim, replace it with a safe
        # fallback instead of returning the unsafe response.
        if grounding_flags:

            if prediction["intent"] == "ACCOUNT_ACCESS_SECURITY":

                response = (
                    "I’m sorry to hear about the account access issue. "
                    "Because this involves account security, please "
                    "contact Amazon customer support so a support "
                    "representative can help you secure your account."
                )

            elif prediction["intent"] == "RETURN_REPLACEMENT_REFUND":

                response = (
                    "I’m sorry you’re still waiting for your refund. "
                    "A support representative can review the return "
                    "and help determine the next steps."
                )

            else:

                response = (
                    "I’m sorry to hear about the issue. "
                    "A support representative can review the issue "
                    "and help determine the next steps."
                )

        # Keep the original flags so the system records that
        # the generated response required grounding correction.
        return AgentResult(

            query=query,

            intent=prediction["intent"],

            intent_confidence=(
                prediction["confidence"]
            ),

            evidence=evidence,

            retrieval_score=retrieval_score,

            decision=decision.decision,

            decision_reason=decision.reason,

            decision_rule=decision.rule,

            response=response,

            grounding_flags=grounding_flags,
        )