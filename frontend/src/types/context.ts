import type { ApiStatus } from "./api";
import type { useAnalyze } from "../hooks/useAnalyze";

export interface OutletContext {
  apiStatus: ApiStatus;
  message: string;
  setMessage: (value: string) => void;
  analyze: ReturnType<typeof useAnalyze>;
}
