import type {
  HistoryDeleteResponse,
  HistoryItem,
  HistoryListResponse,
} from "./types";

// Deliberately not importing from ../services/api.ts, so this feature
// stays fully isolated per the new-files-only constraint. Same env var
// and default as the existing API service.
const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

export class HistoryApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "HistoryApiError";
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
  } catch {
    throw new HistoryApiError(
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
    throw new HistoryApiError(
      detail || `Request failed with status ${res.status}.`,
      res.status,
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new HistoryApiError("The server returned a response we couldn't parse.");
  }
}

export function getHistory(): Promise<HistoryListResponse> {
  return request<HistoryListResponse>("/api/history");
}

export function getHistoryItem(id: number): Promise<HistoryItem> {
  return request<HistoryItem>(`/api/history/${id}`);
}

export function deleteHistoryItem(id: number): Promise<HistoryDeleteResponse> {
  return request<HistoryDeleteResponse>(`/api/history/${id}`, {
    method: "DELETE",
  });
}
