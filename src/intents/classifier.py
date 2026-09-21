from pathlib import Path

import joblib
import numpy as np
from sentence_transformers import SentenceTransformer


class IntentClassifier:

    def __init__(
        self,
        model_dir,
        embedding_model="sentence-transformers/all-MiniLM-L6-v2",
    ):
        model_dir = Path(model_dir)

        classifier_path = model_dir / "classifier.joblib"

        if not classifier_path.exists():
            raise FileNotFoundError(
                f"Intent classifier not found: {classifier_path}"
            )

        self.classifier = joblib.load(classifier_path)

        self.embedding_model = SentenceTransformer(
            embedding_model
        )

    def predict(self, text: str):

        embedding = self.embedding_model.encode(
            [text],
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        probabilities = self.classifier.predict_proba(
            np.asarray(embedding)
        )[0]

        index = int(np.argmax(probabilities))

        label = self.classifier.classes_[index]

        return {
            "intent": str(label),
            "confidence": float(probabilities[index]),
            "probabilities": {
                str(label): float(probability)
                for label, probability
                in zip(
                    self.classifier.classes_,
                    probabilities,
                )
            },
        }