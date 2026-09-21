from src.agent.agent import SupportAgent

from src.intents.classifier import (
    IntentClassifier,
)

from src.retrieval.embeddings import (
    EmbeddingModel,
)

from src.retrieval.index import (
    load_index,
)

from src.retrieval.corpus import (
    load_corpus,
)

from src.retrieval.retriever import (
    HistoricalRetriever,
)

from src.generation.groq_generator import (
    GroqGenerator,
)


def build_agent(
    model_path,
    corpus_path,
    index_path,
    embedding_model=(
        "sentence-transformers/"
        "all-MiniLM-L6-v2"
    ),
    groq_model="openai/gpt-oss-20b",
):

    classifier = IntentClassifier(
        model_dir=model_path,
        embedding_model=embedding_model,
    )

    retrieval_embeddings = (
        EmbeddingModel(
            embedding_model
        )
    )

    index = load_index(
        index_path
    )

    corpus = load_corpus(
        corpus_path
    )

    retriever = HistoricalRetriever(
        embedding_model=retrieval_embeddings,
        index=index,
        corpus=corpus,
    )

    generator = GroqGenerator(
        model=groq_model
    )

    return SupportAgent(
        classifier=classifier,
        retriever=retriever,
        generator=generator,
    )