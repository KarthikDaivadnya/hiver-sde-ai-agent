from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
)


def evaluate_intent(
    y_true,
    y_pred,
):

    return {

        "accuracy": float(
            accuracy_score(
                y_true,
                y_pred,
            )
        ),

        "macro_f1": float(
            f1_score(
                y_true,
                y_pred,
                average="macro",
                zero_division=0,
            )
        ),

        "classification_report":
            classification_report(
                y_true,
                y_pred,
                output_dict=True,
                zero_division=0,
            ),
    }