from dataclasses import dataclass, asdict


@dataclass
class EscalationDecision:

    decision: str
    reason: str
    rule: str

    def to_dict(self):

        return asdict(self)