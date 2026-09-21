from .decision import EscalationDecision
from .rules import RETRIEVAL_SCORE_THRESHOLD


def decide_escalation(
    intent,
    retrieval_score,
    retrieved_resolution_text="",
    customer_text="",
):

    intent = str(intent)

    evidence_text = str(
    retrieved_resolution_text
    ).lower()

    customer_text_normalized = str(
    customer_text
    ).lower()

    # Rule 1
    if intent == "ACCOUNT_ACCESS_SECURITY":

        return EscalationDecision(
            decision="ESCALATE",
            reason=(
                "High-risk account/security issue."
            ),
            rule="HIGH_RISK_ACCOUNT_SECURITY",
        )

    # Rule 2
    if (
        retrieval_score is None
        or retrieval_score
        < RETRIEVAL_SCORE_THRESHOLD
    ):

        return EscalationDecision(
            decision="ESCALATE",
            reason=(
                "Historical retrieval confidence "
                "is below the configured threshold."
            ),
            rule="LOW_RETRIEVAL_CONFIDENCE",
        )

    # Rule 3
    if intent == "PAYMENT_BILLING":

        return EscalationDecision(
            decision="ESCALATE",
            reason=(
                "Payment or billing investigation "
                "requires escalation."
            ),
            rule="PAYMENT_INVESTIGATION",
        )

    # Rule 4
    if intent == "RETURN_REPLACEMENT_REFUND":

        evidence_terms = (
            "refund",
            "refunded",
            "replacement",
            "return",
            "credited",
        )

        if not any(
            term in evidence_text
            for term in evidence_terms
        ):

            return EscalationDecision(
                decision="ESCALATE",
                reason=(
                    "Retrieved evidence does not provide "
                    "sufficient return/refund/replacement evidence."
                ),
                rule=(
                    "RETURN_REFUND_INSUFFICIENT_EVIDENCE"
                ),
            )

    # Rule 5
    unresolved_terms = (
        "still",
        "again",
        "not fixed",
        "unresolved",
        "still waiting",
    )

    if any(
        term in customer_text_normalized
        for term in unresolved_terms
    ):

        return EscalationDecision(
            decision="ESCALATE",
            reason=(
                "Conversation contains an unresolved "
                "or repeated issue signal."
            ),
            rule="UNRESOLVED_OR_REPEATED",
        )

    # Rule 6
    if intent == "OTHER_NON_SUPPORT":

        return EscalationDecision(
            decision="ESCALATE",
            reason=(
                "Issue is non-support or ambiguous."
            ),
            rule="NON_SUPPORT_OR_AMBIGUOUS",
        )

    # Rule 7
    return EscalationDecision(
        decision="AUTO_HANDLE",
        reason=(
            "Actionable intent with historical evidence."
        ),
        rule="ACTIONABLE_WITH_EVIDENCE",
    )