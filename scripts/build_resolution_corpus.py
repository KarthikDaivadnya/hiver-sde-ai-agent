import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse

import pandas as pd


parser = argparse.ArgumentParser()

parser.add_argument(
    "--input",
    required=True,
)

parser.add_argument(
    "--output",
    required=True,
)

args = parser.parse_args()


df = pd.read_csv(
    args.input
)


required_columns = [
    "conversation_id",
    "support_account",
    "conversation_text",
]


missing = [
    column
    for column in required_columns
    if column not in df.columns
]


if missing:

    raise SystemExit(
        f"Missing columns: {missing}"
    )


corpus = df[
    df["support_account"]
    .eq("AmazonHelp")
].copy()


corpus["retrieval_text"] = (
    corpus["conversation_text"]
    .fillna("")
    .astype(str)
)


corpus.to_csv(
    args.output,
    index=False,
)


print(
    f"Saved {len(corpus):,} "
    "AmazonHelp conversations."
)