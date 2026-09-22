/**
 * Types for the History feature. Field names mirror AnalyzeResponse
 * (src/types/api.ts) since a history record is a saved analysis, plus
 * the record's own id/timestamp.
 *
 * IMPORTANT: these are written against the contract described in the
 * History feature request, not against a real backend Interaction
 * model I've inspected — the actual backend wasn't available to me.
 * If your SQLAlchemy model uses different field names (e.g. `created`
 * instead of `created_at`, or nested evidence), adjust this file and
 * the mapping in api.ts — nothing else in this feature needs to change.
 */

export type HistoryDecision = "AUTO_HANDLE" | "ESCALATE";

export interface HistoryItem {
  id: number;
  query: string;
  intent: string;
  intent_confidence: number;
  retrieval_score: number;
  decision: HistoryDecision;
  decision_reason: string;
  decision_rule: string;
  response: string;
  grounding_flags: string[];
  created_at: string;
}

export interface HistoryListResponse {
  items: HistoryItem[];
  total: number;
}

export interface HistoryDeleteResponse {
  success: boolean;
  id: number;
}
