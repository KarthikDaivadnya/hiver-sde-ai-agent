import numpy as np


class HistoricalRetriever:

    def __init__(
        self,
        embedding_model,
        index,
        corpus,
    ):

        self.embedding_model = embedding_model
        self.index = index
        self.corpus = corpus.reset_index(
            drop=True
        )

    def retrieve(
        self,
        query,
        top_k=3,
        candidate_k=10,
    ):

        query_embedding = (
            self.embedding_model.encode(
                [query],
                normalize_embeddings=True,
            )
        )

        scores, ids = self.index.search(
            np.asarray(
                query_embedding,
                dtype="float32",
            ),
            candidate_k,
        )

        results = []

        for score, row_id in zip(
            scores[0],
            ids[0],
        ):

            if row_id < 0:
                continue

            row = (
                self.corpus
                .iloc[int(row_id)]
                .to_dict()
            )

            row["score"] = float(score)

            results.append(row)

        return results[:top_k]