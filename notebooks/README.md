# Hiver SDE AI Agent — Split Notebooks

These notebooks are split from `1_customer_support_agent.ipynb` according to the requested
research pipeline.

Order:
00 Project Setup
01 Dataset Quality
02 Conversation Reconstruction
03 Brand Selection
04 Intent Taxonomy & Annotation
05 Intent Classification
06 Historical Resolution Retrieval
07 Response & Escalation Agent
08 Evaluation & Failure Analysis

Important:
- Every original source cell is preserved exactly once and kept in original order within its assigned notebook.
- `SPLIT_MANIFEST.json` records the exact source-cell mapping.
- Run notebooks in numerical order.
- Persisted artifacts should live under `data/raw`, `data/processed`, and `data/golden`.
- The split is intentionally structural; it does not silently rewrite experimental results.
