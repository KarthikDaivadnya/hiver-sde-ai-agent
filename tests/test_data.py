from src.data.cleaning import (
    clean_text,
)


def test_clean_text():

    assert (
        clean_text(
            "   hello     world   "
        )
        == "hello world"
    )