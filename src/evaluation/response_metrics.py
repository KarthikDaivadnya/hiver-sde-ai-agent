DIMENSIONS = [
    "correctness",
    "relevance",
    "grounding",
    "helpfulness",
    "tone",
    "completeness",
]


def mean_scores(df):

    return {
        dimension: float(
            df[dimension].mean()
        )
        for dimension in DIMENSIONS
        if dimension in df.columns
    }