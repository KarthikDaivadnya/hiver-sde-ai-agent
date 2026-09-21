import { BarChart3, Info, LayoutGrid, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/analyze", label: "Analyze", icon: Search, end: false },
  { to: "/evaluations", label: "Evaluations", icon: BarChart3, end: false },
  { to: "/about", label: "About", icon: Info, end: false },
];

export function Sidebar() {
  return (
    <nav
      className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-surface/60 p-3 sm:flex"
      aria-label="Primary"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-accent-soft text-ink"
                : "text-subtle hover:bg-surface hover:text-ink"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={16}
                strokeWidth={2}
                className={isActive ? "text-accent" : "text-faint"}
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
