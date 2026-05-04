import { useMemo } from "react";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { useAppStore } from "../store/AppStore";
import { Badge } from "../components/ui/Badge";
import { LineChartCard } from "../components/charts/LineChartCard.tsx";
import { DoughnutChartCard } from "../components/charts/DoughnutChartCard.tsx";

export function DashboardPage() {
  const { state } = useAppStore();

  const stats = useMemo(() => {
    const users = state.users.length;
    const donors = state.users.filter((u) => u.role === "donor").length;
    const requests = state.requests.length;
    const donations = state.donations.length;
    const critical = state.requests.filter((r) => r.type === "urgent" && r.urgency === "critical" && r.status === "open").length;
    return { users, donors, requests, donations, critical };
  }, [state]);

  const requestsByDay = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [7, 11, 9, 13, 10, 8, 12];
    return { labels, data };
  }, []);

  const donationsByDay = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [3, 5, 4, 6, 4, 3, 7];
    return { labels, data };
  }, []);

  const requestSplit = useMemo(() => {
    const urgent = state.requests.filter((r) => r.type === "urgent").length;
    const scheduled = state.requests.filter((r) => r.type === "scheduled").length;
    return {
      labels: ["Urgent", "Scheduled"],
      data: [urgent, scheduled],
    };
  }, [state.requests]);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <div>
              <CardMeta>Total Users</CardMeta>
              <CardTitle className="text-2xl">{stats.users}</CardTitle>
            </div>
            <Badge tone="info">Live</Badge>
          </CardHeader>
          <div className="text-sm text-[var(--fg-2)]">Registered app accounts (mock).</div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardMeta>Donors</CardMeta>
              <CardTitle className="text-2xl">{stats.donors}</CardTitle>
            </div>
            <Badge tone="success">Available</Badge>
          </CardHeader>
          <div className="text-sm text-[var(--fg-2)]">Active donor base snapshot.</div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardMeta>Requests</CardMeta>
              <CardTitle className="text-2xl">{stats.requests}</CardTitle>
            </div>
            <Badge tone="neutral">All</Badge>
          </CardHeader>
          <div className="text-sm text-[var(--fg-2)]">Urgent + scheduled requests.</div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardMeta>Donations</CardMeta>
              <CardTitle className="text-2xl">{stats.donations}</CardTitle>
            </div>
            <Badge tone="success">Verified</Badge>
          </CardHeader>
          <div className="text-sm text-[var(--fg-2)]">Confirmation workflow (UI only).</div>
        </Card>

        <Card className="border-[var(--primary-light)]">
          <CardHeader>
            <div>
              <CardMeta>Critical</CardMeta>
              <CardTitle className="text-2xl">{stats.critical}</CardTitle>
            </div>
            <Badge tone="danger">Urgent</Badge>
          </CardHeader>
          <div className="text-sm text-[var(--fg-2)]">Open critical urgent requests.</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <LineChartCard
          title="Requests (7d)"
          subtitle="Basic trend"
          labels={requestsByDay.labels}
          data={requestsByDay.data}
        />
        <LineChartCard
          title="Donations (7d)"
          subtitle="Verification pipeline"
          labels={donationsByDay.labels}
          data={donationsByDay.data}
          color="var(--success)"
        />
        <DoughnutChartCard
          title="Urgent vs Scheduled"
          subtitle="Mix of request types"
          labels={requestSplit.labels}
          data={requestSplit.data}
        />
      </div>
    </div>
  );
}
