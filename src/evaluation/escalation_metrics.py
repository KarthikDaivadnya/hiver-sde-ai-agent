from sklearn.metrics import (
    confusion_matrix,
    precision_recall_fscore_support,
)


def evaluate_escalation(
    y_true,
    y_pred,
):

    precision, recall, f1, _ = (
        precision_recall_fscore_support(
            y_true,
            y_pred,
            pos_label="ESCALATE",
            average="binary",
            zero_division=0,
        )
    )

    return {

        "precision": float(
            precision
        ),

        "recall": float(
            recall
        ),

        "f1": float(
            f1
        ),

        "confusion_matrix":
            confusion_matrix(
                y_true,
                y_pred,
                labels=[
                    "AUTO_HANDLE",
                    "ESCALATE",
                ],
            ).tolist(),
    }