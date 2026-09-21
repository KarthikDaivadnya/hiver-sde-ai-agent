from src.evaluation.retrieval_metrics import (
    reciprocal_rank,
)


def test_reciprocal_rank():

    assert (
        reciprocal_rank(
            [0, 2, 0]
        )
        == 0.5
    )