import { NavLink, Outlet, useMatches } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";
import logoUrl from "../assets/SevaSethu_Logo.png";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/users", label: "Users" },
  { to: "/requests", label: "Requests" },
  { to: "/donations", label: "Donations" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/alerts", label: "Alerts" },
  { to: "/blood-banks", label: "Blood Banks" },
  { to: "/reports", label: "Reports" },
];

type MatchHandle = { title?: string };

export function AppLayout() {
  const { state, actions } = useAppStore();
  const matches = useMatches();
  const activeTitle = (matches[matches.length - 1]?.handle as MatchHandle | undefined)?.title ?? "";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[260px_1fr] gap-6 p-6">
        <aside className="sticky top-6 h-[calc(100vh-3rem)] rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-surface)]">
              <img src={logoUrl} alt="SevaSethu" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide">SevaSethu</div>
              <div className="text-xs text-[var(--fg-2)]">Admin Dashboard</div>
            </div>
          </div>

          <nav className="p-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-[var(--primary-surface)] text-[var(--primary)]"
                      : "text-[var(--fg-2)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                  )
                }
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] opacity-70" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-[var(--border)] p-4">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <div className="text-xs font-semibold text-[var(--fg-2)]">Theme</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">{state.theme === "dark" ? "Dark" : "Light"}</div>
                <Button variant="ghost" size="sm" onClick={actions.toggleTheme}>
                  Toggle
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">{activeTitle}</div>
              <div className="mt-1 text-sm text-[var(--fg-2)]">
                Mock admin console • UI only • No backend
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => window.alert("This dashboard uses mock data only.")}>Help</Button>
              <Button variant="primary">Admin</Button>
            </div>
          </header>

          <Outlet />

          <footer className="mt-10 pb-6 text-xs text-[var(--fg-3)]">
            © {new Date().getFullYear()} SevaSethu • Admin UI (mock)
          </footer>
        </main>
      </div>
    </div>
  );
}
