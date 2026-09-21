from src.generation.grounding import (
    detect_unsupported_action_claims,
)


def test_unsupported_action_detection():

    flags = (
        detect_unsupported_action_claims(
            "I have forwarded this to the team."
        )
    )

    assert flags