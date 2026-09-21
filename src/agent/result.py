from dataclasses import dataclass, asdict


@dataclass
class AgentResult:

    query: str

    intent: str
    intent_confidence: float

    evidence: list

    retrieval_score: float | None

    decision: str
    decision_reason: str
    decision_rule: str

    response: str

    grounding_flags: list

    def to_dict(self):

        return asdict(self)