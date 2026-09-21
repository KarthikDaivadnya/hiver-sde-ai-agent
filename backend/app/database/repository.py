from .models import Interaction


def save_interaction(
    db,
    result,
):

    interaction = Interaction(

        customer_query=result.query,

        intent=result.intent,

        intent_confidence=(
            result.intent_confidence
        ),

        retrieval_score=(
            result.retrieval_score
        ),

        decision=result.decision,

        decision_reason=(
            result.decision_reason
        ),

        decision_rule=(
            result.decision_rule
        ),

        generated_response=(
            result.response
        ),
    )

    db.add(
        interaction
    )

    db.commit()

    db.refresh(
        interaction
    )

    return interaction


def count_interactions(
    db
):

    return (
        db.query(
            Interaction
        ).count()
    )