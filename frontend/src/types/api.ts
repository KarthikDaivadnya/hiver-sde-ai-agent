/**
 * Types mirror the FastAPI backend's response models exactly.
 * If the backend schema differs, update these types and the
 * mapping in services/api.ts — do not invent fields here.
 */

export type Decision = "AUTO_HANDLE" | "ESCALATE";

export interface EvidenceItem {
  conversation_id?: string | number;
  conversation_text: string;
  score: number;
  first_customer_message?: string;
  last_customer_message?: string;
  first_support_message?: string;
  last_support_message?: string;
  support_account?: string;
}

export interface AnalyzeRequest {
  message: string;
}

export interface AnalyzeResponse {
  query: string;
  intent: string;
  intent_confidence: number;
  evidence: EvidenceItem[];
  retrieval_score: number;
  decision: Decision;
  decision_reason: string;
  decision_rule: string;
  response: string;
  grounding_flags: string[];
}

export interface HealthResponse {
  status?: string;
  [key: string]: unknown;
}

export interface MetricsResponse {
  [key: string]: unknown;
}

export type ApiStatus = "checking" | "connected" | "offline";
