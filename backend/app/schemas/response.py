from pydantic import (
    BaseModel,
)


class EvidenceItem(
    BaseModel
):

    conversation_id: str | int

    score: float

    conversation_text: str

    support_account: str


class AnalyzeResponse(
    BaseModel
):

    query: str

    intent: str

    intent_confidence: float

    evidence: list[
        EvidenceItem
    ]

    retrieval_score: float | None

    decision: str

    decision_reason: str

    decision_rule: str

    response: str

    grounding_flags: list[str]