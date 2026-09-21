import numpy as np
import pandas as pd


def reconstruct_conversation_ids(df):

    df = df.copy()

    tweet_ids = df["tweet_id"].to_numpy()

    id_to_position = pd.Series(
        np.arange(len(df)),
        index=tweet_ids,
    )

    parent_ids = df["in_response_to_tweet_id"]

    valid_parent = (
        parent_ids.notna()
        & parent_ids.isin(id_to_position.index)
    )

    root = np.arange(
        len(df),
        dtype=np.int64,
    )

    valid_positions = np.flatnonzero(
        valid_parent.to_numpy()
    )

    parent_positions = (
        parent_ids.loc[valid_parent]
        .astype(np.int64)
        .map(id_to_position)
        .to_numpy()
    )

    root[valid_positions] = parent_positions

    for _ in range(32):

        new_root = root.copy()

        valid_root = (
            (root >= 0)
            & (root < len(root))
        )

        new_root[valid_root] = root[
            root[valid_root]
        ]

        if np.array_equal(
            new_root,
            root,
        ):
            break

        root = new_root

    df["conversation_id"] = tweet_ids[root]

    return df