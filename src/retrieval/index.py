from pathlib import Path

import faiss
import numpy as np


def build_faiss_index(embeddings):

    embeddings = np.asarray(
        embeddings,
        dtype="float32",
    )

    index = faiss.IndexFlatIP(
        embeddings.shape[1]
    )

    index.add(embeddings)

    return index


def save_index(index, path):

    Path(path).parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    faiss.write_index(
        index,
        str(path),
    )


def load_index(path):

    return faiss.read_index(
        str(path)
    )