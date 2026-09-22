"""
History API router — NEW FILE, does not modify any existing backend module.

IMPORTANT — READ BEFORE USING:
I was not given your actual backend source (only two research notebooks were
shared with me), so I could not inspect your real `Interaction` SQLAlchemy
model, session factory, or repository as the brief asked. Writing this against
an imagined model import (e.g. `from app.models import Interaction`) risked
producing something that fails to import at all if your module layout is
different.

Instead, this router talks to your EXISTING SQLite database
(`database/hiver_agent.db` by default, override with env var
HIVER_DB_PATH) directly through SQLAlemy Core, and reflects the interactions
table's real columns at startup rather than assuming an ORM model shape. It
tries a short list of plausible column name variants (e.g. `response` vs
`generated_response`, `created_at` vs `timestamp`) so it has a good chance of
working unmodified — but you should verify the COLUMN_ALIASES map below
against your actual schema and adjust it if needed.

If you already have a working `Interaction` model + session dependency,
it is straightforward (and better) to replace the reflection logic in
`_get_table()` with your real model — everything else (the three routes,
response shaping, error handling) can stay the same.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import MetaData, Table, create_engine, delete, select
from sqlalchemy.engine import Engine

router = APIRouter(prefix="/api/history", tags=["history"])

DB_PATH = os.environ.get("HIVER_DB_PATH", "database/hiver_agent.db")
_engine: Engine | None = None
_table: Table | None = None

# If your actual column names differ from these guesses, add the real
# name to the front of the matching list.
COLUMN_ALIASES: dict[str, list[str]] = {
    "id": ["id", "interaction_id"],
    "query": ["query", "message", "customer_message"],
    "intent": ["intent"],
    "intent_confidence": ["intent_confidence", "confidence"],
    "retrieval_score": ["retrieval_score"],
    "decision": ["decision"],
    "decision_reason": ["decision_reason", "reason"],
    "decision_rule": ["decision_rule", "rule"],
    "response": ["response", "generated_response", "reply"],
    "grounding_flags": ["grounding_flags", "flags"],
    "created_at": ["created_at", "timestamp", "created"],
}


class HistoryItem(BaseModel):
    id: int
    query: str
    intent: str
    intent_confidence: float
    retrieval_score: float
    decision: str
    decision_reason: str
    decision_rule: str
    response: str
    grounding_flags: list[str]
    created_at: str


class HistoryListResponse(BaseModel):
    items: list[HistoryItem]
    total: int


class HistoryDeleteResponse(BaseModel):
    success: bool
    id: int


def _get_engine() -> Engine:
    global _engine
    if _engine is None:
        if not os.path.exists(DB_PATH):
            raise HTTPException(
                status_code=500,
                detail=(
                    f"History database not found at '{DB_PATH}'. Set the "
                    "HIVER_DB_PATH environment variable if it lives elsewhere."
                ),
            )
        _engine = create_engine(f"sqlite:///{DB_PATH}")
    return _engine


def _get_table() -> Table:
    """Reflect the interactions table from the existing database.

    Looks for a table literally named 'interactions' or 'interaction'
    first; if neither exists, falls back to the first reflected table
    that contains 'interaction' in its name. Replace this with a direct
    import of your real ORM model if you have one available.
    """
    global _table
    if _table is not None:
        return _table

    engine = _get_engine()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    for name in ("interactions", "interaction"):
        if name in metadata.tables:
            _table = metadata.tables[name]
            return _table

    for name, table in metadata.tables.items():
        if "interaction" in name.lower():
            _table = table
            return _table

    raise HTTPException(
        status_code=500,
        detail=(
            "Couldn't find an interactions table in the database. "
            f"Tables found: {list(metadata.tables.keys())}. Update "
            "_get_table() in history.py to point at the right one."
        ),
    )


def _resolve_column(table: Table, canonical: str) -> str | None:
    for candidate in COLUMN_ALIASES.get(canonical, [canonical]):
        if candidate in table.columns:
            return candidate
    return None


def _row_to_history_item(table: Table, row: Any) -> HistoryItem:
    mapping = row._mapping  # SQLAlchemy Row -> dict-like

    def get(canonical: str, default: Any = None) -> Any:
        col = _resolve_column(table, canonical)
        return mapping.get(col, default) if col else default

    raw_flags = get("grounding_flags", [])
    if isinstance(raw_flags, str):
        try:
            parsed = json.loads(raw_flags)
            flags = parsed if isinstance(parsed, list) else []
        except (json.JSONDecodeError, TypeError):
            flags = [raw_flags] if raw_flags else []
    elif isinstance(raw_flags, list):
        flags = raw_flags
    else:
        flags = []

    raw_created = get("created_at")
    if isinstance(raw_created, datetime):
        created_at = raw_created.isoformat()
    elif raw_created is None:
        created_at = ""
    else:
        created_at = str(raw_created)

    return HistoryItem(
        id=int(get("id")),
        query=str(get("query", "")),
        intent=str(get("intent", "")),
        intent_confidence=float(get("intent_confidence", 0.0) or 0.0),
        retrieval_score=float(get("retrieval_score", 0.0) or 0.0),
        decision=str(get("decision", "")),
        decision_reason=str(get("decision_reason", "")),
        decision_rule=str(get("decision_rule", "")),
        response=str(get("response", "")),
        grounding_flags=flags,
        created_at=created_at,
    )


@router.get("", response_model=HistoryListResponse)
def list_history() -> HistoryListResponse:
    table = _get_table()
    id_col = _resolve_column(table, "id")
    created_col = _resolve_column(table, "created_at")

    engine = _get_engine()
    stmt = select(table)
    if created_col is not None:
        stmt = stmt.order_by(table.c[created_col].desc())
    elif id_col is not None:
        stmt = stmt.order_by(table.c[id_col].desc())

    with engine.connect() as conn:
        rows = conn.execute(stmt).all()

    items = [_row_to_history_item(table, row) for row in rows]
    return HistoryListResponse(items=items, total=len(items))


@router.get("/{interaction_id}", response_model=HistoryItem)
def get_history_item(interaction_id: int) -> HistoryItem:
    table = _get_table()
    id_col = _resolve_column(table, "id")
    if id_col is None:
        raise HTTPException(status_code=500, detail="No identifiable ID column found.")

    engine = _get_engine()
    stmt = select(table).where(table.c[id_col] == interaction_id)
    with engine.connect() as conn:
        row = conn.execute(stmt).first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail=f"No analysis found with id {interaction_id}.",
        )

    return _row_to_history_item(table, row)


@router.delete("/{interaction_id}", response_model=HistoryDeleteResponse)
def delete_history_item(interaction_id: int) -> HistoryDeleteResponse:
    table = _get_table()
    id_col = _resolve_column(table, "id")
    if id_col is None:
        raise HTTPException(status_code=500, detail="No identifiable ID column found.")

    engine = _get_engine()
    with engine.begin() as conn:
        existing = conn.execute(
            select(table).where(table.c[id_col] == interaction_id)
        ).first()
        if existing is None:
            raise HTTPException(
                status_code=404,
                detail=f"No analysis found with id {interaction_id}.",
            )
        conn.execute(delete(table).where(table.c[id_col] == interaction_id))

    return HistoryDeleteResponse(success=True, id=interaction_id)
