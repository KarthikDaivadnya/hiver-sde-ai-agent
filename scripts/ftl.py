import argparse

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


if "intent_label" not in df.columns:

    df["intent_label"] = ""


df.to_csv(
    args.output,
    index=False,
)


print(
    "Training template created."
)

print(
    "Populate intent_label only with "
    "validated annotations."
)