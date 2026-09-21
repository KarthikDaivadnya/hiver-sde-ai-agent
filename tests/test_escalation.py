from src.escalation.policy import (
    decide_escalation,
)


def test_account_security_escalates():

    result = decide_escalation(

        intent=(
            "ACCOUNT_ACCESS_SECURITY"
        ),

        retrieval_score=0.90,

        retrieved_resolution_text="",

        customer_text=(
            "I am locked out of my account."
        ),
    )

    assert (
        result.decision
        == "ESCALATE"
    )