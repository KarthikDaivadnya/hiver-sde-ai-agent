from functools import lru_cache

from src.agent.pipeline import (
    build_agent,
)

from .config import settings


@lru_cache(maxsize=1)
def get_agent():

    return build_agent(

        model_path=(
            settings.intent_model_path
        ),

        corpus_path=(
            settings.corpus_path
        ),

        index_path=(
            settings.index_path
        ),

        embedding_model=(
            settings.embedding_model
        ),

        groq_model=(
            settings.groq_model
        ),
    )