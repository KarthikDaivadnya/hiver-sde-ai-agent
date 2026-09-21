from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


ROOT = Path(
    __file__
).resolve().parents[3]


class Settings(
    BaseSettings
):

    groq_api_key: str | None = None

    intent_model_path: str = str(
        ROOT
        / "backend/artifacts/intent_model"
    )

    corpus_path: str = str(
        ROOT
        / "backend/artifacts/corpus/"
          "amazonhelp_corpus.csv"
    )

    index_path: str = str(
        ROOT
        / "backend/artifacts/faiss/"
          "amazonhelp.index"
    )

    embedding_model: str = (
        "sentence-transformers/"
        "all-MiniLM-L6-v2"
    )

    groq_model: str = (
        "openai/gpt-oss-20b"
    )

    database_url: str = str(
        "sqlite:///"
        + str(
            ROOT
            / "database/"
              "hiver_agent.db"
        )
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()