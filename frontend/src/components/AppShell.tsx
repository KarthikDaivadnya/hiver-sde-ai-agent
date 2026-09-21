import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAnalyze } from "../hooks/useAnalyze";
import { useApiStatus } from "../hooks/useApiStatus";
import { useTheme } from "../hooks/useTheme";
import type { OutletContext } from "../types/context";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const apiStatus = useApiStatus();
  const { theme, toggleTheme } = useTheme();
  // Held here, rather than inside the Analyze page, so the query and
  // its result survive navigating away and back to Analyze.
  const [message, setMessage] = useState("");
  const analyze = useAnalyze();

  const context: OutletContext = { apiStatus, message, setMessage, analyze };

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <Header apiStatus={apiStatus} theme={theme} onToggleTheme={toggleTheme} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="scrollbar-thin flex-1 overflow-y-auto pb-20 sm:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
            <Outlet context={context} />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
