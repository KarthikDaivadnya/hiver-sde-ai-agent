import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse
from pathlib import Path

import joblib
import pandas as pd

from sklearn.linear_model import (
    LogisticRegression,
)

from sentence_transformers import (
    SentenceTransformer,
)


parser = argparse.ArgumentParser()

parser.add_argument(
    "--input",
    required=True,
)

parser.add_argument(
    "--output",
    required=True,
)

parser.add_argument(
    "--embedding-model",
    default=(
        "sentence-transformers/"
        "all-MiniLM-L6-v2"
    ),
)

args = parser.parse_args()


df = pd.read_csv(
    args.input
)


if "intent_label" not in df.columns:

    raise SystemExit(
        "intent_label column is missing."
    )


if df["intent_label"].isna().any():

    raise SystemExit(
        "The training CSV contains missing "
        "intent labels. Do not invent labels. "
        "Use the validated labelled 300-example "
        "training set."
    )


text_column = (
    "conversation_text"
    if "conversation_text" in df.columns
    else "first_customer_message"
)


texts = (
    df[text_column]
    .fillna("")
    .astype(str)
    .tolist()
)


labels = (
    df["intent_label"]
    .astype(str)
    .to_numpy()
)


print(
    "Loading SentenceTransformer..."
)


embedder = SentenceTransformer(
    args.embedding_model
)


print(
    f"Encoding {len(texts):,} examples..."
)


embeddings = embedder.encode(

    texts,

    normalize_embeddings=True,

    show_progress_bar=True,

)


print(
    "Training Logistic Regression..."
)


classifier = LogisticRegression(

    max_iter=3000,

    class_weight="balanced",

)


classifier.fit(
    embeddings,
    labels,
)


output_dir = Path(
    args.output
)

output_dir.mkdir(
    parents=True,
    exist_ok=True,
)


joblib.dump(

    classifier,

    output_dir
    / "classifier.joblib",

)


print(
    f"Saved model to {output_dir}"
)