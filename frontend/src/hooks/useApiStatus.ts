import { useEffect, useRef, useState } from "react";
import { checkHealth } from "../services/api";
import type { ApiStatus } from "../types/api";

const POLL_INTERVAL_MS = 30_000;

export function useApiStatus() {
  const [status, setStatus] = useState<ApiStatus>("checking");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        await checkHealth();
        if (mounted.current) setStatus("connected");
      } catch {
        if (mounted.current) setStatus("offline");
      }
    }

    poll();
    const id = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, []);

  return status;
}
