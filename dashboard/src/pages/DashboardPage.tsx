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
        const openRequests = state.requests.filter((r) => r.status === "open").length;
        const donations = state.donations.length;
        return { users, donors, requests, openRequests, donations };
    }, [state]);

    const requestsByDay = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const labels = days.map((d) =>
            d.toLocaleDateString(undefined, { weekday: "short" }),
        );
        const data = days.map((d) => {
            const start = d.getTime();
            const end = start + 24 * 60 * 60 * 1000;
            return state.requests.filter((r) => {
                const t = new Date(r.createdAt).getTime();
                return t >= start && t < end;
            }).length;
        });
        return { labels, data };
    }, [state.requests]);

    const donationsByDay = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });
        const labels = days.map((d) =>
            d.toLocaleDateString(undefined, { weekday: "short" }),
        );
        const data = days.map((d) => {
            const start = d.getTime();
            const end = start + 24 * 60 * 60 * 1000;
            return state.donations.filter((don) => {
                const t = new Date(don.date).getTime();
                return t >= start && t < end;
            }).length;
        });
        return { labels, data };
    }, [state.donations]);

    const requestSplit = useMemo(() => {
        const open = state.requests.filter((r) => r.status === "open");
        const urgent = open.filter((r) => r.type === "urgent").length;
        const scheduled = open.filter((r) => r.type === "scheduled").length;
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
                            <CardTitle className="text-2xl">
                                {stats.users}
                            </CardTitle>
                        </div>
                        <Badge tone="info">Live</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Registered app accounts (mock).
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Donors</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.donors}
                            </CardTitle>
                        </div>
                        <Badge tone="success">Available</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Active donor base snapshot.
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Requests</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.requests}
                            </CardTitle>
                        </div>
                        <Badge tone="neutral">All</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Urgent + scheduled requests.
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Donations</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.donations}
                            </CardTitle>
                        </div>
                        <Badge tone="success">Verified</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Confirmation workflow overview.
                    </div>
                </Card>

                <Card className="border-[var(--primary-light)]">
                    <CardHeader>
                        <div>
                            <CardMeta>Open Requests</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.openRequests}
                            </CardTitle>
                        </div>
                        <Badge tone="warning">Live</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Requests currently waiting to be fulfilled.
                    </div>
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
                    subtitle="Open requests split"
                    labels={requestSplit.labels}
                    data={requestSplit.data}
                />
            </div>
        </div>
    );
}
