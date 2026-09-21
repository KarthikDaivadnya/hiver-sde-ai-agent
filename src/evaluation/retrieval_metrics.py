import numpy as np


def hit_at_k(
    relevance,
    k,
):

    return float(
        any(
            score > 0
            for score in relevance[:k]
        )
    )


def reciprocal_rank(
    relevance,
):

    for rank, score in enumerate(
        relevance,
        start=1,
    ):

        if score > 0:
            return 1.0 / rank

    return 0.0


def ndcg_at_k(
    relevance,
    k,
):

    values = np.asarray(
        relevance[:k],
        dtype=float,
    )

    if len(values) == 0:
        return 0.0

    discounts = np.log2(
        np.arange(
            2,
            len(values) + 2,
        )
    )

    dcg = np.sum(
        (2 ** values - 1)
        / discounts
    )

    ideal = np.sort(
        values
    )[::-1]

    idcg = np.sum(
        (2 ** ideal - 1)
        / discounts
    )

    if idcg == 0:
        return 0.0

    return float(
        dcg / idcg
    )