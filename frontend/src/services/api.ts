import type {
  AnalyzeRequest,
  AnalyzeResponse,
  HealthResponse,
  MetricsResponse,
} from "../types/api";

const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch (err) {
    throw new ApiError(
      "Couldn't reach the backend. Make sure the FastAPI server is running.",
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.message ?? "";
    } catch {
      /* response wasn't JSON — ignore */
    }
    throw new ApiError(
      detail || `Request failed with status ${res.status}.`,
      res.status,
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("The server returned a response we couldn't parse.");
  }
}

export function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export function analyzeQuery(message: string): Promise<AnalyzeResponse> {
  const payload: AnalyzeRequest = { message };
  return request<AnalyzeResponse>("/api/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMetrics(): Promise<MetricsResponse> {
  return request<MetricsResponse>("/api/metrics");
}

export { BASE_URL };
