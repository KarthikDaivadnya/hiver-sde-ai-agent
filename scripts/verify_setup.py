import sys
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import os
from pathlib import Path


ROOT = (
    Path(__file__)
    .resolve()
    .parents[1]
)


FILES = [

    ROOT
    / "data/raw/twcs.csv",

    ROOT
    / "data/processed/"
      "resolution_episodes.csv",

    ROOT
    / "data/processed/"
      "taxonomy_audit_150.csv",

    ROOT
    / "data/processed/"
      "groq_response_generation_150.csv",

    ROOT
    / "data/processed/"
      "llm_judge_evaluation_final_150.csv",

]


for path in FILES:

    status = (
        "OK"
        if path.exists()
        else "MISSING"
    )

    print(
        f"[{status}] "
        f"{path.relative_to(ROOT)}"
    )


print()


if os.getenv(
    "GROQ_API_KEY"
):

    print(
        "[OK] GROQ_API_KEY"
    )

else:

    print(
        "[MISSING] GROQ_API_KEY"
    )