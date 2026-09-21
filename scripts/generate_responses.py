import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse

import pandas as pd

from src.generation.groq_generator import (
    GroqGenerator,
)

from src.generation.prompts import (
    build_generation_prompt,
)


parser = argparse.ArgumentParser()

parser.add_argument(
    "--input",
    required=True,
)

parser.add_argument(
    "--output",
    required=True,
)

args = parser.parse_args()


df = pd.read_csv(
    args.input
)


generator = GroqGenerator()


results = []


for _, row in df.iterrows():

    evidence = []

    for number in (
        1,
        2,
        3,
    ):

        text = row.get(
            f"retrieval_{number}_conversation_text",
            "",
        )

        if pd.notna(text):

            evidence.append({
                "conversation_text":
                    str(text)
            })


    prompt = build_generation_prompt(

        customer_context=row.get(
            "generation_context",
            row.get(
                "customer_query",
                "",
            ),
        ),

        intent=row.get(
            "intent_label",
            "",
        ),

        decision=row.get(
            "policy_decision",
            "",
        ),

        decision_reason=row.get(
            "policy_reason_text",
            "",
        ),

        evidence=evidence,
    )


    result = generator.generate(
        prompt
    )


    results.append({

        **row.to_dict(),

        "groq_reply":
            result["text"],

        "finish_reason":
            result["finish_reason"],

    })


pd.DataFrame(
    results
).to_csv(
    args.output,
    index=False,
)


print(
    f"Saved {len(results)} responses."
)