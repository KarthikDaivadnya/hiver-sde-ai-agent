<div align="center">

# 🤖 Hiver AI Support Agent

**A historically grounded AI customer-support agent for Twitter conversations**

An end-to-end system that understands customer intent, retrieves relevant historical resolutions, makes an explicit escalation decision, and generates evidence-grounded support responses.

Built as a Hiver SDE Intern take-home assignment using the public **Customer Support on Twitter (TWCS)** dataset.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Vite-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FAISS](https://img.shields.io/badge/Retrieval-FAISS-4B8BBE)](https://github.com/facebookresearch/faiss)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#-license)

**Understand → Retrieve → Decide → Generate → Validate**

</div>

---

## 📑 Table of contents

- [What this project does](#-what-this-project-does)
- [Project objective](#-project-objective)
- [Key results](#-key-results)
- [Core design](#-core-design)
- [Intent taxonomy](#️-intent-taxonomy)
- [Retrieval-augmented support](#-retrieval-augmented-support)
- [Explicit escalation policy](#️-explicit-escalation-policy)
- [Grounded response generation](#️-grounded-response-generation)
- [Application](#️-application)
- [Evaluation framework](#-evaluation-framework)
- [Project structure](#-project-structure)
- [Tech stack](#️-tech-stack)
- [Quick start](#-quick-start)
- [Running tests](#-run-tests)
- [Reproducing the pipeline](#-reproducing-the-pipeline)
- [Safety & design principles](#-safety--design-principles)
- [Limitations](#️-limitations)
- [Dataset](#-dataset)
- [Engineering decisions](#-engineering-decisions)
- [What makes this different](#-what-makes-the-approach-different)
- [Example](#-example)
- [Future improvements](#-future-improvements)
- [Author](#-author)

---

## 🚀 What this project does

The agent processes a customer-support query through a complete decision pipeline:

```
Customer Query
      ↓
Conversation Understanding
      ↓
Intent Classification
      ↓
Historical Resolution Retrieval
      ↓
Evidence Quality Check
      ↓
Auto-Handle / Escalate Decision
      ↓
Grounded Response Generation
      ↓
Safety / Grounding Validation
      ↓
Final Support Response
```

### In one glance

| Capability | Implementation |
|---|---|
| 💬 Customer understanding | Conversation-aware intent classification |
| 🧠 Intent detection | 15 AmazonHelp support intents |
| 🔎 Historical retrieval | Sentence embeddings + FAISS |
| 🛡️ Escalation | Explicit, deterministic policy |
| ✍️ Response generation | Groq `openai/gpt-oss-20b` |
| 🚨 Hallucination protection | Grounding checks + safe fallbacks |
| ⚡ API | FastAPI |
| 🗄️ Interaction storage | SQLite |
| 🎨 Frontend | React + Vite + TypeScript + Tailwind |
| 🧪 Evaluation | Intent, retrieval, escalation & LLM-as-judge |
| 🔬 Reproducibility | Scripts, notebooks, tests & documented metrics |

---

## 🎯 Project objective

Customer-support automation should not simply generate a plausible answer. It should answer four important questions:

1. **What** is the customer asking about?
2. **Have similar issues** been successfully resolved before?
3. **Is it safe** to handle automatically, or should it be escalated?
4. **Can the response be supported by evidence** — without inventing actions or policies?

This project was designed around those four principles.

---

## 🏆 Key results

Evaluated using controlled benchmark sets built from the AmazonHelp portion of TWCS. These are **controlled benchmark results, not claims of real-world customer-support resolution performance.**

### Intent classification

300 validated labelled examples — 225 training / 75 validation. Embeddings: `all-MiniLM-L6-v2` (SentenceTransformers) → Logistic Regression.

| Metric | Result |
|---|---|
| Validation accuracy | **20.00%** |
| Validation macro F1 | **18.65%** |

> Macro F1 was used as the primary model-selection metric because the benchmark contains multiple intents with uneven support.

### Historical retrieval

81,796 leakage-safe AmazonHelp resolution episodes.

| Metric | Result |
|---|---|
| Hit@1 | **64.00%** |
| Hit@3 | **82.00%** |
| MRR | **71.44%** |
| nDCG@3 | **87.50%** |
| Precision@3 | **59.11%** |

### Response evaluation

150 generated responses, scored with an LLM-as-judge rubric.

**Overall mean: 1.724 / 2.0 — 86.2% of maximum score**

| Dimension | Score |
|---|---|
| Correctness | 85.3% |
| Relevance | 87.0% |
| Grounding | 84.7% |
| Helpfulness | 81.0% |
| Tone | 95.3% |
| Completeness | 84.0% |

### Most common failure modes

| Failure mode | Rate |
|---|---|
| Incomplete response | 13.33% |
| Fabricated detail | 9.33% |
| Missed escalation | 8.67% |
| Unsupported action | 8.67% |
| Unnecessary escalation | 5.33% |
| Irrelevant response | 4.00% |
| Wrong intent | 3.33% |

---

## 🧠 Core design

### 1. Conversation reconstruction

The original TWCS dataset contains individual tweets rather than ready-made conversations. The project reconstructs conversation chains using `in_response_to_tweet_id`, tweet timestamps, tweet IDs, and inbound/outbound direction.

This produced:

- **2,811,774** tweets
- **798,197** reconstructed conversations
- **99.81%** valid parent references
- **99.9972%** parent-before-child timestamp ordering

### 2. Brand selection

Brands are evaluated on conversation depth and availability of useful support interactions. **AmazonHelp** was selected because it provides a large, sufficiently deep support corpus — thousands of multi-turn conversations suitable for intent discovery, resolution retrieval, escalation analysis, and response generation.

---

## 🏷️ Intent taxonomy

The system uses **15 support intents**, developed from the actual AmazonHelp conversations rather than imposed independently of the dataset:

1. `DELIVERY_DELAY`
2. `DELIVERY_MISSING_OR_MISDELIVERED`
3. `DELIVERY_ATTEMPT_OR_INSTRUCTIONS`
4. `ORDER_STATUS_OR_CANCELLATION`
5. `RETURN_REPLACEMENT_REFUND`
6. `PRODUCT_PROBLEM`
7. `PAYMENT_BILLING`
8. `PRIME_MEMBERSHIP`
9. `ACCOUNT_ACCESS_SECURITY`
10. `GIFT_CARD_PROMOTION`
11. `PRODUCT_AVAILABILITY_INFORMATION`
12. `DIGITAL_CONTENT`
13. `DEVICE_TECHNICAL_SUPPORT`
14. `WEBSITE_APP_TECHNICAL`
15. `OTHER_NON_SUPPORT`

---

## 🔎 Retrieval-augmented support

The agent retrieves historical support episodes **before** generating an answer:

```
Historical AmazonHelp Conversations
              ↓
      Resolution Episodes
              ↓
   SentenceTransformer Embeddings
              ↓
          FAISS Index
              ↓
       Top-K Similar Episodes
              ↓
       Evidence for Response
```

The serving retrieval corpus excludes the benchmark conversations used for intent training and taxonomy evaluation, to reduce evaluation leakage.

---

## 🛡️ Explicit escalation policy

A key design decision: **the LLM does not independently decide whether a case should be escalated.**

```
Intent
  +
Retrieval Confidence
  +
Evidence Quality
  +
Safety Rules
       ↓
Deterministic Escalation Policy
       ↓
AUTO_HANDLE / ESCALATE
```

**Examples**

<table>
<tr>
<td valign="top">

**Account security**
```
ACCOUNT_ACCESS_SECURITY
        ↓
     ESCALATE
        ↓
HIGH_RISK_ACCOUNT_SECURITY
```

</td>
<td valign="top">

**Low retrieval confidence**
```
Retrieval score < threshold
        ↓
     ESCALATE
        ↓
LOW_RETRIEVAL_CONFIDENCE
```

</td>
<td valign="top">

**Insufficient refund evidence**
```
RETURN_REPLACEMENT_REFUND
        +
Insufficient evidence
        ↓
     ESCALATE
```

</td>
</tr>
</table>

This separation makes the system more predictable, auditable, and safer than allowing a generative model to make operational decisions implicitly.

---

## ✍️ Grounded response generation

The response generator receives the customer conversation, predicted intent, retrieved historical evidence, escalation decision, and escalation reason.

The generation prompt explicitly **prohibits** the model from pretending to:

- access customer accounts or orders
- check live shipment status
- modify or cancel orders
- issue refunds or create replacements
- contact internal support teams
- perform any action it cannot actually perform

If an unsafe operational claim is detected, the system substitutes a conservative, safe fallback response:

```
Generated response
       ↓
Grounding validation
       ↓
   ┌────────────────┐         ┌────────────────┐
   │ Safe            │  ──►   │ Return response │
   └────────────────┘         └────────────────┘
       ↓ (if unsafe claim)
   ┌────────────────┐
   │ Safe fallback   │
   └────────────────┘
```

---

## 🖥️ Application

A complete web application ships alongside the research pipeline.

| Layer | Stack |
|---|---|
| Frontend | React · Vite · TypeScript · Tailwind CSS |
| Backend | FastAPI · Python · SQLite · SQLAlchemy |

**Main workflow**

```
User enters customer message
            ↓
        React UI
            ↓
       FastAPI API
            ↓
      AI Agent Pipeline
            ↓
 ┌─────────────────────────┐
 │ Intent · Retrieval       │
 │ Escalation · Generation  │
 │ Grounding                │
 └─────────────────────────┘
            ↓
       JSON Response
            ↓
        React UI
```

Analyzed interactions are also stored in SQLite for application-level history and metrics.

---

## 📊 Evaluation framework

<details>
<summary><b>Intent evaluation</b></summary>

- Majority-class baseline
- TF-IDF + Logistic Regression
- Word + character TF-IDF + Linear SVM
- SentenceTransformer + Logistic Regression

</details>

<details>
<summary><b>Retrieval evaluation</b></summary>

- Precision@K
- Hit@K
- MRR
- nDCG@K

</details>

<details>
<summary><b>Escalation evaluation</b></summary>

- Precision / Recall / F1
- False-auto rate
- False-escalation rate

</details>

<details>
<summary><b>Response evaluation</b></summary>

An LLM-as-judge evaluates **correctness, relevance, grounding, helpfulness, tone,** and **completeness**, and tags failure modes:

`FABRICATED_DETAIL` · `UNSUPPORTED_ACTION` · `WRONG_INTENT` · `MISSED_ESCALATION` · `UNNECESSARY_ESCALATION` · `IRRELEVANT_RESPONSE` · `INCOMPLETE_RESPONSE`

</details>

---

## 📁 Project structure

```
hiver-sde-ai-agent/
│
├── configs/
│   ├── config.yaml
│   ├── intents.yaml
│   └── escalation_rules.yaml
│
├── data/
│   ├── raw/twcs.csv
│   ├── processed/
│   └── golden/
│
├── notebooks/
│   ├── 01_dataset_reconnaissance.ipynb
│   ├── 02_brand_selection.ipynb
│   ├── 03_conversation_reconstruction.ipynb
│   ├── 04_eda.ipynb
│   ├── 05_intent_taxonomy.ipynb
│   ├── 06_intent_baselines.ipynb
│   ├── 07_intent_classifier.ipynb
│   ├── 08_resolution_retrieval.ipynb
│   ├── 09_escalation_policy.ipynb
│   ├── 10_response_generation.ipynb
│   ├── 11_llm_judge_evaluation.ipynb
│   └── 12_failure_analysis.ipynb
│
├── src/
│   ├── agent/
│   ├── data/
│   ├── escalation/
│   ├── evaluation/
│   ├── generation/
│   ├── intents/
│   └── retrieval/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   └── schemas/
│   ├── artifacts/
│   └── requirements.txt
│
├── scripts/
│   ├── build_conversations.py
│   ├── build_resolution_corpus.py
│   ├── build_intent_model.py
│   ├── build_retrieval_index.py
│   ├── generate_response.py
│   ├── run_evaluation.py
│   └── verify_setup.py
│
├── tests/
│   ├── test_agent.py
│   ├── test_api.py
│   ├── test_data.py
│   ├── test_escalation.py
│   ├── test_generation.py
│   ├── test_intent.py
│   └── test_retrieval.py
│
├── reports/
│   ├── decision_log.md
│   ├── methodology.md
│   ├── evaluation_report.md
│   └── failure_analysis.md
│
├── database/
│   └── hiver_agent.db
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🛠️ Tech stack

| Category | Tools |
|---|---|
| AI / ML | Python · Pandas · NumPy · Scikit-learn · SentenceTransformers · FAISS |
| Generative AI | Groq API · `openai/gpt-oss-20b` |
| Backend | FastAPI · SQLAlchemy · SQLite · Pydantic |
| Frontend | React · Vite · TypeScript · Tailwind CSS |
| Dev & testing | Jupyter · Pytest · Git · GitHub |

---

## 🚀 Quick start

**1. Clone the repository**

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd hiver-sde-ai-agent
```

**2. Create a virtual environment**

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
pip install -r backend/requirements.txt
```

**4. Configure environment variables**

Create `.env` from `.env.example`:

```bash
GROQ_API_KEY=your_groq_api_key
```

> ⚠️ Never commit your real `.env` file or API keys.

### ▶️ Run the backend

```bash
uvicorn backend.app.main:app --reload --port 8000
```

| Resource | URL |
|---|---|
| Backend | http://localhost:8000 |
| API docs | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

### 🎨 Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite dev URL printed in the terminal, and talks to the backend via:

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧪 Run tests

```bash
pytest -q
```

The current automated test suite passes successfully.

---

## 📦 Reproducing the pipeline

```
Dataset
   ↓
Conversation Reconstruction
   ↓
Brand Selection
   ↓
Resolution Corpus
   ↓
Intent Taxonomy
   ↓
Intent Training → Intent Model
   ↓
FAISS Retrieval Index
   ↓
Escalation Policy
   ↓
Response Generation
   ↓
LLM Evaluation
   ↓
Failure Analysis
```

**Key scripts**

```bash
python scripts/build_conversations.py
python scripts/build_resolution_corpus.py
python scripts/build_intent_model.py
python scripts/build_retrieval_index.py
python scripts/generate_response.py
python scripts/run_evaluation.py
python scripts/verify_setup.py
```

> The full TWCS dataset is intentionally not committed to GitHub because of its size. The repository is structured so the dataset can be placed locally and the documented pipeline reproduced.

---

## 🔐 Safety & design principles

1. **Evidence before generation** — the LLM receives retrieved historical evidence rather than generating support policies from scratch.
2. **Explicit escalation** — determined by a transparent policy, not hidden inside generation.
3. **No fabricated operational actions** — the agent never claims to have checked an account/order, changed an order, issued a refund, created a replacement, or contacted another support team, unless actually supported by the system.
4. **Safe fallback** — an unsafe operational claim in a generated answer is replaced with a conservative response.
5. **Leakage-aware evaluation** — benchmark conversations are excluded from the retrieval serving corpus.

---

## ⚠️ Limitations

This is a **research/prototype implementation**, not a production customer-support system.

- Intent classification was evaluated on a relatively small labelled benchmark.
- The validation set has limited support for some intents.
- Retrieval quality depends on the available historical conversations.
- Escalation targets are project-defined, not production-labelled ground truth.
- LLM-as-judge evaluation can introduce evaluator bias.
- The generator and judge share the same model family, so judge scores are not independent human validation.
- Evaluation does not establish real-world customer resolution rates.
- Live Amazon account/order/support-system integrations are intentionally not implemented.
- Genuine independent human-agreement statistics are not reported in the current benchmark.

---

## 📚 Dataset

**[Customer Support on Twitter (TWCS)](https://www.kaggle.com/datasets/thoughtvector/customer-support-on-twitter)** — `thoughtvector/customer-support-on-twitter`

Contains customer-support conversations involving brands on Twitter/X. This project uses **AmazonHelp** as the selected brand.

---

## 📌 Engineering decisions

Important design decisions are documented in [`reports/decision_log.md`](reports/decision_log.md), covering: brand selection, conversation reconstruction strategy, resolution evidence definition, intent taxonomy design, classifier selection, retrieval strategy, leakage prevention, escalation architecture, generation model choice, grounding safeguards, evaluation methodology, failure analysis, and reproducibility decisions.

---

## 🔬 What makes the approach different?

Rather than building a simple `Query → LLM → Answer` pipeline, this project uses:

```
Query → Understand → Classify Intent → Retrieve Historical Evidence
      → Assess Evidence → Make Explicit Decision → Generate Grounded Response
      → Validate Safety → Respond
```

This creates a more auditable, explainable, and controllable customer-support workflow.

---

## 💡 Example

> **Customer:** *"My Amazon order was supposed to arrive yesterday but it still hasn't arrived."*

| Field | Value |
|---|---|
| Intent | `DELIVERY_DELAY` |
| Historical evidence | Relevant AmazonHelp resolution episodes |
| Decision | `AUTO_HANDLE` |
| Reason | `ACTIONABLE_WITH_EVIDENCE` |
| Response | A concise reply grounded in the retrieved historical support evidence |

For a security-sensitive request:

```
Customer Query
      ↓
ACCOUNT_ACCESS_SECURITY
      ↓
     ESCALATE
      ↓
HIGH_RISK_ACCOUNT_SECURITY
      ↓
Safe human-support guidance
```

---

## 📈 Future improvements

- Larger human-labelled intent dataset
- Independent human evaluation + Cohen's kappa measurement
- Better intent classification with more training data
- Cross-encoder retrieval reranking
- More robust resolution-quality modelling
- Confidence calibration
- Production observability
- Authentication and authorization
- Real customer-support integrations
- Human-agent feedback loops
- Online evaluation and monitoring

---

## 👨‍💻 Author

**Karthik Daivadnya**
Computer Science Engineering · AI/ML · Data Science · Full-Stack Development

<div align="center">

### ⭐ Project summary

A complete AI customer-support agent that combines intent classification, historical retrieval, deterministic escalation, grounded LLM generation, safety validation, evaluation, and a production-style FastAPI + React application.

**Understand → Retrieve → Decide → Generate → Validate**

</div>