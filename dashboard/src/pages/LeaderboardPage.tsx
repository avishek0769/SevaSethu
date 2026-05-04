import { useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { cn } from "../utils/cn";
import type { LeaderboardCategory, LeaderboardScope } from "../data/types";
import { useAppStore } from "../store/AppStore";

function rankColor(rank: number) {
  if (rank === 1) return "var(--gold)";
  if (rank === 2) return "var(--silver)";
  if (rank === 3) return "var(--bronze)";
  return "var(--platinum)";
}

export function LeaderboardPage() {
  const { state } = useAppStore();
  const [scope, setScope] = useState<LeaderboardScope>("city");
  const [category, setCategory] = useState<LeaderboardCategory>("individuals");

  const rows = useMemo(() => {
    return category === "individuals" ? state.leaderboardIndividuals : state.leaderboardBanks;
  }, [category, state.leaderboardIndividuals, state.leaderboardBanks]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardMeta>Individuals + blood banks — city/state/country (mock)</CardMeta>
          </div>
          <Badge tone="info">UI only</Badge>
        </CardHeader>

        <div className="flex flex-wrap items-center gap-2">
          {(["city", "state", "country"] as const).map((s) => (
            <Button key={s} variant={scope === s ? "primary" : "secondary"} size="sm" onClick={() => setScope(s)}>
              {s.toUpperCase()}
            </Button>
          ))}
          <div className="mx-2 h-6 w-px bg-[var(--border)]" />
          {(["individuals", "bloodBanks"] as const).map((c) => (
            <Button key={c} variant={category === c ? "primary" : "secondary"} size="sm" onClick={() => setCategory(c)}>
              {c === "individuals" ? "Individuals" : "Blood Banks"}
            </Button>
          ))}
          <div className="ml-auto text-sm text-[var(--fg-2)]">Scope: {scope}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold",
                  "text-[var(--on-primary)]"
                )}
                style={{ backgroundColor: rankColor(r.rank) }}
              >
                #{r.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{r.name}</div>
                <div className="truncate text-xs text-[var(--fg-2)]">{r.scopeLabel}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-[var(--primary)]">{r.tokens}</div>
                <div className="text-xs text-[var(--fg-2)]">tokens</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[var(--surface-2)] p-3">
                <div className="text-xs font-semibold text-[var(--fg-2)]">Donations</div>
                <div className="mt-1 text-sm font-bold">{r.donations}</div>
              </div>
              <div className="rounded-2xl bg-[var(--surface-2)] p-3">
                <div className="text-xs font-semibold text-[var(--fg-2)]">Scope</div>
                <div className="mt-1 text-sm font-bold">{scope.toUpperCase()}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
