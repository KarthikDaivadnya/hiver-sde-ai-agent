# Support Intelligence — AmazonHelp AI Support Agent (Frontend)

A production-quality frontend for the Hiver take-home AI customer-support
agent. This app is the **frontend only** — it expects your existing FastAPI
backend to be running separately.

## What this connects to

The app calls three endpoints on your backend:

| Method | Path            | Used for                                   |
| ------ | --------------- | ------------------------------------------- |
| GET    | `/health`       | The connection indicator in the header      |
| POST   | `/api/analyze`  | The Analyze page's core request             |
| GET    | `/api/metrics`  | Available via `services/api.ts` (not yet wired into a page — see below) |

`POST /api/analyze` is expected to accept `{ "message": string }` and return:

```json
{
  "query": "...",
  "intent": "...",
  "intent_confidence": 0.0,
  "evidence": [{ "conversation_text": "...", "score": 0.0 }],
  "retrieval_score": 0.0,
  "decision": "AUTO_HANDLE" | "ESCALATE",
  "decision_reason": "...",
  "decision_rule": "...",
  "response": "...",
  "grounding_flags": []
}
```

If your backend's actual field names or shapes differ, update
`src/types/api.ts` and `src/services/api.ts` to match — those two files are
the only places that need to change.

## Running it

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL if your backend isn't on :8000
npm run dev
```

Open the printed local URL. Make sure your FastAPI backend is running first —
the header's status indicator will show **API offline** until it's reachable.

## Environment variables

- `VITE_API_BASE_URL` — base URL of your FastAPI backend. Defaults to
  `http://localhost:8000` if unset.

## Project structure

```
src/
  components/   Reusable UI pieces (cards, header, sidebar, etc.)
  pages/        Overview, Analyze, Evaluations, About
  hooks/        useApiStatus, useTheme, useAnalyze
  services/     api.ts — the one place fetch() calls live
  types/        API and context TypeScript interfaces
  utils/        Formatting helpers, intent taxonomy copy, benchmark constants
```

## Notes on the Evaluations page

The numbers on the Evaluations and Overview pages (retrieval Hit@3, escalation
precision/recall, LLM-as-judge response quality, failure category counts,
etc.) are hard-coded in `src/utils/benchmarks.ts`. They're your project's own
offline benchmark results — not something the backend serves live — so they're
kept as constants rather than fetched. Update that file directly if your
numbers change.

## What's intentionally NOT here

Per the project brief, this frontend does not implement: order tracking,
Amazon login, ticket creation, refund processing, agent assignment, a CRM, or
any live Amazon account data. The `/api/analyze` response is displayed as-is,
labeled as an AI-generated draft grounded in historical evidence — never as a
live account action.

## Quality checks already run

- `npx tsc -b` — no type errors
- `npm run build` — production build succeeds
- `npx eslint .` — no lint errors
