from sklearn.metrics import (
    cohen_kappa_score,
)


DIMENSIONS = [
    "correctness",
    "relevance",
    "grounding",
    "helpfulness",
    "tone",
    "completeness",
]


def agreement_table(
    model_df,
    human_df,
    key="benchmark_id",
):

    merged = model_df.merge(
        human_df,
        on=key,
        suffixes=(
            "_model",
            "_human",
        ),
    )

    results = {}

    for dimension in DIMENSIONS:

        results[dimension] = float(
            cohen_kappa_score(
                merged[
                    f"{dimension}_model"
                ],
                merged[
                    f"{dimension}_human"
                ],
            )
        )

    return results