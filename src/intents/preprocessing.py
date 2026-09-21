import re


def normalize_text(text: str) -> str:
    if text is None:
        return ""

    text = str(text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def build_query_text(text: str) -> str:
    return normalize_text(text)