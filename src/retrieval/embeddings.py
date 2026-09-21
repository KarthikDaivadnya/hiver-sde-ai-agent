from sentence_transformers import SentenceTransformer


class EmbeddingModel:

    def __init__(
        self,
        model_name="sentence-transformers/all-MiniLM-L6-v2",
    ):

        self.model = SentenceTransformer(
            model_name
        )

    def encode(
        self,
        texts,
        batch_size=64,
        normalize_embeddings=True,
        show_progress_bar=False,
    ):

        return self.model.encode(
            list(texts),
            batch_size=batch_size,
            normalize_embeddings=normalize_embeddings,
            show_progress_bar=show_progress_bar,
        )