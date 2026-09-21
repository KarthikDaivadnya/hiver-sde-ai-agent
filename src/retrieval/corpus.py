import pandas as pd


REQUIRED_COLUMNS = [
    "conversation_id",
    "conversation_text",
    "support_account",
]


def load_corpus(path):

    df = pd.read_csv(path)

    missing = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Corpus missing columns: {missing}"
        )

    df = df[
        df["support_account"]
        .eq("AmazonHelp")
    ].copy()

    df["retrieval_text"] = (
        df["conversation_text"]
        .fillna("")
        .astype(str)
    )

    return df.reset_index(drop=True)