import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse
import pandas as pd

from src.data.conversation import reconstruct_conversation_ids


parser = argparse.ArgumentParser(
    description="Build conversation-level data from TWCS."
)

parser.add_argument("--input", required=True)
parser.add_argument("--output", required=True)

args = parser.parse_args()

print("=" * 70)
print("HIVER CONVERSATION-LEVEL DATA BUILD")
print("=" * 70)

# ------------------------------------------------------------
# 1. Load the original TWCS dataset
# ------------------------------------------------------------

print("\nReading TWCS dataset...")

df = pd.read_csv(
    args.input,
    usecols=[
        "tweet_id",
        "author_id",
        "inbound",
        "created_at",
        "text",
        "response_tweet_id",
        "in_response_to_tweet_id",
    ],
)

print(f"Tweets loaded: {len(df):,}")

# ------------------------------------------------------------
# 2. Reconstruct conversation IDs
# ------------------------------------------------------------

print("\nReconstructing conversation IDs...")

df = reconstruct_conversation_ids(df)

print(
    f"Unique conversations: "
    f"{df['conversation_id'].nunique():,}"
)

# ------------------------------------------------------------
# 3. Parse timestamps
# ------------------------------------------------------------

df["created_at_parsed"] = pd.to_datetime(
    df["created_at"],
    errors="coerce",
    utc=True,
)

# ------------------------------------------------------------
# 4. Identify support account per conversation
#
# inbound=False = company/support -> customer
# inbound=True  = customer -> company
# ------------------------------------------------------------

print("\nIdentifying support accounts...")

support_rows = df.loc[
    df["inbound"].eq(False),
    ["conversation_id", "author_id"],
].copy()

support_rows = support_rows.dropna(
    subset=["conversation_id", "author_id"]
)

support_accounts = (
    support_rows
    .groupby("conversation_id")["author_id"]
    .agg(
        lambda values: values.astype(str).mode().iloc[0]
    )
    .rename("support_account")
    .reset_index()
)

print(
    f"Conversations with support responses: "
    f"{len(support_accounts):,}"
)

# ------------------------------------------------------------
# 5. Attach support account to each tweet
# ------------------------------------------------------------

df = df.merge(
    support_accounts,
    on="conversation_id",
    how="inner",
)

# ------------------------------------------------------------
# 6. Sort conversation turns chronologically
# ------------------------------------------------------------

print("\nOrdering conversation turns...")

df = df.sort_values(
    [
        "conversation_id",
        "created_at_parsed",
        "tweet_id",
    ],
    kind="mergesort",
)

# ------------------------------------------------------------
# 7. Build readable conversation turns
# ------------------------------------------------------------

def format_turn(row):
    if bool(row["inbound"]):
        speaker = "Customer"
    else:
        speaker = str(row["author_id"])

    text = str(row["text"])

    return f"{speaker}: {text}"


df["turn_text"] = df.apply(
    format_turn,
    axis=1,
)

# ------------------------------------------------------------
# 8. Aggregate tweets into conversations
# ------------------------------------------------------------

print("\nBuilding conversation text...")

conversation_df = (
    df.groupby(
        [
            "conversation_id",
            "support_account",
        ],
        sort=False,
    )["turn_text"]
    .agg("\n".join)
    .reset_index()
    .rename(
        columns={
            "turn_text": "conversation_text"
        }
    )
)

# ------------------------------------------------------------
# 9. Save
# ------------------------------------------------------------

conversation_df.to_csv(
    args.output,
    index=False,
)

print("\n" + "=" * 70)
print("CONVERSATION BUILD COMPLETE")
print("=" * 70)

print(
    f"Conversations saved: "
    f"{len(conversation_df):,}"
)

print(
    f"Output: {args.output}"
)

print(
    f"Columns: "
    f"{conversation_df.columns.tolist()}"
)

print("\nTop support accounts:")

print(
    conversation_df[
        "support_account"
    ]
    .value_counts()
    .head(10)
)