import { useCallback, useState } from "react";
import { analyzeQuery, ApiError } from "../services/api";
import type { AnalyzeResponse } from "../types/api";

interface AnalyzeState {
  status: "idle" | "loading" | "success" | "error";
  result: AnalyzeResponse | null;
  error: string | null;
}

export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({
    status: "idle",
    result: null,
    error: null,
  });

  const run = useCallback(async (message: string) => {
    setState({ status: "loading", result: null, error: null });
    try {
      const result = await analyzeQuery(message);
      setState({ status: "success", result, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong while analyzing this message.";
      setState({ status: "error", result: null, error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", result: null, error: null });
  }, []);

  return { ...state, run, reset };
}
