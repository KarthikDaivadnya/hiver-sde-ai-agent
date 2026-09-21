import sys
from pathlib import Path

# ------------------------------------------------------------
# Make project root importable
# ------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


import argparse

import faiss
import numpy as np
import pandas as pd

from src.retrieval.embeddings import EmbeddingModel


# ------------------------------------------------------------
# Arguments
# ------------------------------------------------------------

parser = argparse.ArgumentParser()

parser.add_argument(
    "--corpus",
    required=True,
)

parser.add_argument(
    "--index",
    required=True,
)

parser.add_argument(
    "--model",
    default=(
        "sentence-transformers/"
        "all-MiniLM-L6-v2"
    ),
)

parser.add_argument(
    "--batch-size",
    type=int,
    default=32,
)

parser.add_argument(
    "--chunksize",
    type=int,
    default=2000,
)

args = parser.parse_args()


# ------------------------------------------------------------
# Paths
# ------------------------------------------------------------

corpus_path = Path(args.corpus)
index_path = Path(args.index)

index_path.parent.mkdir(
    parents=True,
    exist_ok=True,
)


if not corpus_path.exists():

    raise FileNotFoundError(
        f"Corpus not found: {corpus_path}"
    )


# ------------------------------------------------------------
# Load embedding model
# ------------------------------------------------------------

print()
print("=" * 70)
print("HIVER RETRIEVAL INDEX BUILD")
print("=" * 70)
print()

print(
    f"Embedding model: {args.model}"
)

print(
    f"Embedding batch size: {args.batch_size}"
)

print(
    f"CSV chunksize: {args.chunksize}"
)

print()

embedder = EmbeddingModel(
    args.model
)


# ------------------------------------------------------------
# Determine corpus columns
# ------------------------------------------------------------

print("Reading corpus header...")

header = pd.read_csv(
    corpus_path,
    nrows=0,
)

required_columns = [
    "conversation_id",
    "conversation_text",
    "support_account",
]

missing = [
    column
    for column in required_columns
    if column not in header.columns
]

if missing:

    raise ValueError(
        f"Corpus is missing columns: {missing}"
    )


# ------------------------------------------------------------
# FAISS index
# ------------------------------------------------------------

faiss_index = None

total_rows = 0
processed_rows = 0


# ------------------------------------------------------------
# Process CSV in chunks
# ------------------------------------------------------------

print()
print("Starting chunked corpus processing...")
print()

for chunk_number, chunk in enumerate(

    pd.read_csv(
        corpus_path,
        usecols=[
            "conversation_id",
            "conversation_text",
            "support_account",
        ],
        chunksize=args.chunksize,
    ),

    start=1,

):

    # --------------------------------------------------------
    # AmazonHelp only
    # --------------------------------------------------------

    chunk = chunk[
        chunk["support_account"]
        .eq("AmazonHelp")
    ].copy()


    if chunk.empty:
        continue


    # --------------------------------------------------------
    # Clean retrieval text
    # --------------------------------------------------------

    texts = (
        chunk[
            "conversation_text"
        ]
        .fillna("")
        .astype(str)
        .tolist()
    )


    # --------------------------------------------------------
    # Generate embeddings
    # --------------------------------------------------------

    embeddings = embedder.encode(

        texts,

        batch_size=args.batch_size,

        normalize_embeddings=True,

        show_progress_bar=False,

    )


    embeddings = np.asarray(
        embeddings,
        dtype="float32",
    )


    # --------------------------------------------------------
    # Create FAISS index on first batch
    # --------------------------------------------------------

    if faiss_index is None:

        dimension = embeddings.shape[1]

        faiss_index = faiss.IndexFlatIP(
            dimension
        )


    # --------------------------------------------------------
    # Add embeddings
    # --------------------------------------------------------

    faiss_index.add(
        embeddings
    )


    processed_rows += len(chunk)


    print(
        f"Chunk {chunk_number:04d} | "
        f"AmazonHelp rows: {len(chunk):5d} | "
        f"Indexed: {processed_rows:7,d}"
    )


# ------------------------------------------------------------
# Validate
# ------------------------------------------------------------

if faiss_index is None:

    raise RuntimeError(
        "No AmazonHelp conversations were found."
    )


# ------------------------------------------------------------
# Save FAISS index
# ------------------------------------------------------------

faiss.write_index(
    faiss_index,
    str(index_path),
)


print()
print("=" * 70)
print("FAISS INDEX BUILD COMPLETE")
print("=" * 70)
print()

print(
    f"Vectors indexed: {faiss_index.ntotal:,}"
)

print(
    f"Vector dimension: {faiss_index.d}"
)

print(
    f"Index path: {index_path}"
)

print()