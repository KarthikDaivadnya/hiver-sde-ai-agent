import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.core.dependencies import get_agent


agent = get_agent()

result = agent.analyze(
    "My Amazon order is two days late. Can you tell me what is happening?"
)

print("\n=== AGENT RESULT ===")
print("Intent:", result.intent)
print("Confidence:", round(result.intent_confidence, 4))

if result.retrieval_score is not None:
    print(
        "Retrieval score:",
        round(result.retrieval_score, 4)
    )
else:
    print("Retrieval score: None")

print("Decision:", result.decision)
print("Reason:", result.decision_reason)
print("Rule:", result.decision_rule)
print("Grounding flags:", result.grounding_flags)

print("\nResponse:")
print(result.response)

print("\nEvidence:")

for i, evidence in enumerate(
    result.evidence,
    start=1,
):
    score = evidence.get("score")
    text = evidence.get(
        "conversation_text",
        "",
    )

    print(f"\n[{i}] score={score:.4f}")
    print(
        text[:500]
        .replace("\n", " ")
    )
