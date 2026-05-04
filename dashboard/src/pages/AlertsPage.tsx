import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { useAppStore } from "../store/AppStore";

export function AlertsPage() {
  const { state, actions } = useAppStore();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Alerts</CardTitle>
            <CardMeta>Critical / unfulfilled requests and rare blood needs</CardMeta>
          </div>
          <Badge tone="danger">{state.alerts.filter((a) => !a.notified).length} pending</Badge>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {state.alerts.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="mt-1 text-sm text-[var(--fg-2)]">{a.message}</div>
              </div>
              <Badge tone={a.severity === "critical" ? "danger" : "warning"} className="capitalize">
                {a.severity}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {a.bloodGroups.map((bg) => (
                <Badge key={bg} tone="danger" className="bg-[var(--primary-soft)] text-[var(--primary)]">
                  {bg}
                </Badge>
              ))}
              <div className="ml-auto text-xs text-[var(--fg-3)]">{new Date(a.createdAt).toLocaleString()}</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-[var(--fg-2)]">Notify donors button is UI-only.</div>
              <Button
                variant={a.notified ? "secondary" : "primary"}
                onClick={() => {
                  if (!a.notified) actions.markAlertNotified(a.id);
                }}
              >
                {a.notified ? "Notified" : "Notify donors"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
