import { useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Table, Td, Th } from "../components/ui/Table";
import { REQUEST_STATUSES } from "../data/constants";
import type { Request } from "../data/types";
import { useAppStore } from "../store/AppStore";

function statusTone(status: Request["status"]): Parameters<typeof Badge>[0]["tone"] {
  if (status === "open") return "warning";
  if (status === "accepted") return "info";
  if (status === "fulfilled") return "success";
  if (status === "resolved") return "neutral";
  return "danger";
}

export function RequestsPage() {
  const { state, actions } = useAppStore();
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return state.requests.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [state.requests, type, status]);

  const selected = useMemo(() => state.requests.find((r) => r.id === selectedId) ?? null, [state.requests, selectedId]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Request Queue</CardTitle>
            <CardMeta>Urgent + scheduled requests (UI only)</CardMeta>
          </div>
          <Badge tone="info">{filtered.length} items</Badge>
        </CardHeader>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            <option value="urgent">Urgent</option>
            <option value="scheduled">Scheduled</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg-2)]">
            Tip: use “Escalate” for critical unfulfilled.
          </div>
        </div>
      </Card>

      <Table>
        <thead>
          <tr>
            <Th>Request</Th>
            <Th>Type</Th>
            <Th>Blood / Units</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="hover:bg-[var(--surface-2)]/60">
              <Td>
                <div className="font-semibold">{r.hospital}</div>
                <div className="text-xs text-[var(--fg-2)]">{r.city} • {new Date(r.createdAt).toLocaleDateString()}</div>
              </Td>
              <Td>
                <Badge tone={r.type === "urgent" ? "danger" : "neutral"}>
                  {r.type}
                </Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Badge tone="danger" className="bg-[var(--primary-soft)] text-[var(--primary)]">
                    {r.bloodGroup}
                  </Badge>
                  <span className="text-sm text-[var(--fg-2)]">{r.units} unit(s)</span>
                </div>
              </Td>
              <Td>
                <Badge tone={statusTone(r.status)} className="capitalize">
                  {r.status}
                </Badge>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(r.id)}>
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => actions.setRequestStatus(r.id, "resolved")}>
                    Mark Resolved
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => actions.setRequestStatus(r.id, "escalated")}>
                    Escalate
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selected ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Request Details</CardTitle>
              <CardMeta>{selected.id}</CardMeta>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
              Close
            </Button>
          </CardHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Notes</div>
              <div className="mt-1 text-sm text-[var(--fg)]">{selected.notes}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Accepted Count</div>
              <div className="mt-1 text-sm font-semibold">{selected.acceptedCount}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Urgency</div>
              <div className="mt-1">
                <Badge tone={selected.urgency === "critical" ? "danger" : selected.urgency === "high" ? "warning" : "neutral"} className="capitalize">
                  {selected.urgency}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
