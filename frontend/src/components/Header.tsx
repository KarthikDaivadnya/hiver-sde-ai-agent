import { Moon, ShieldCheck, Sun } from "lucide-react";
import type { ApiStatus } from "../types/api";
import { StatusIndicator } from "./StatusIndicator";

interface HeaderProps {
  apiStatus: ApiStatus;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ apiStatus, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
          <ShieldCheck size={17} strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">Support Intelligence</p>
          <p className="text-[11px] text-faint">AmazonHelp · AI Support Agent</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:block">
          <StatusIndicator status={apiStatus} />
        </div>
        <button
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-subtle transition hover:text-ink active:scale-[0.96]"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
