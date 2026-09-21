from datetime import (
    datetime,
    timezone,
)

from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
)


class Base(
    DeclarativeBase
):
    pass


class Interaction(Base):

    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    created_at: Mapped[datetime] = (
        mapped_column(
            DateTime,
            default=lambda:
                datetime.now(
                    timezone.utc
                ),
        )
    )

    customer_query: Mapped[str] = (
        mapped_column(Text)
    )

    intent: Mapped[str] = (
        mapped_column(String(100))
    )

    intent_confidence: Mapped[float] = (
        mapped_column(Float)
    )

    retrieval_score: Mapped[
        float | None
    ] = mapped_column(
        Float,
        nullable=True,
    )

    decision: Mapped[str] = (
        mapped_column(String(30))
    )

    decision_reason: Mapped[str] = (
        mapped_column(Text)
    )

    decision_rule: Mapped[str] = (
        mapped_column(String(100))
    )

    generated_response: Mapped[str] = (
        mapped_column(Text)
    )