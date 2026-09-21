import argparse
import json

import pandas as pd


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


dimensions = [
    "correctness",
    "relevance",
    "grounding",
    "helpfulness",
    "tone",
    "completeness",
]


available = [
    dimension
    for dimension in dimensions
    if dimension in df.columns
]


if not available:

    raise SystemExit(
        "No evaluation score columns found."
    )


metrics = {

    dimension:
        float(
            df[dimension].mean()
        )

    for dimension in available

}


metrics["overall_mean"] = float(
    df[available]
    .mean(axis=1)
    .mean()
)


with open(
    args.output,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        metrics,
        file,
        indent=2,
    )


print(
    json.dumps(
        metrics,
        indent=2,
    )
)