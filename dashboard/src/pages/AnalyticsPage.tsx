import { useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { BarChartCard } from "../components/charts/BarChartCard";
import { Table, Td, Th } from "../components/ui/Table";
import { BLOOD_GROUPS } from "../data/constants";
import { useAppStore } from "../store/AppStore";

const DAY_MS = 24 * 60 * 60 * 1000;

export function AnalyticsPage() {
    const { state } = useAppStore();

    const bloodGroupStats = useMemo(() => {
        const openRequests = state.requests.filter((r) => r.status === "open");
        const availableDonors = state.users.filter(
            (u) => u.role === "donor" && u.isAvailable && !u.isFlagged,
        );

        const rows = BLOOD_GROUPS.map((bg) => {
            const demandUnits = openRequests
                .filter((r) => r.bloodGroup === bg)
                .reduce((sum, r) => sum + r.units, 0);
            const supply = availableDonors.filter((u) => u.bloodGroup === bg)
                .length;
            const shortage = Math.max(0, demandUnits - supply);
            return { bg, demandUnits, supply, shortage };
        }).sort((a, b) => b.shortage - a.shortage);

        return {
            labels: rows.map((r) => r.bg),
            demand: rows.map((r) => r.demandUnits),
            supply: rows.map((r) => r.supply),
            shortage: rows.map((r) => r.shortage),
            rows,
        };
    }, [state.requests, state.users]);

    const geo = useMemo(() => {
        const openRequests = state.requests.filter((r) => r.status === "open");
        const availableDonors = state.users.filter(
            (u) => u.role === "donor" && u.isAvailable && !u.isFlagged,
        );

        const cities = Array.from(
            new Set([
                ...state.users.map((u) => u.city),
                ...state.requests.map((r) => r.city),
            ]),
        );

        const rows = cities
            .map((city) => {
                const openUnits = openRequests
                    .filter((r) => r.city === city)
                    .reduce((sum, r) => sum + r.units, 0);
                const donors = availableDonors.filter((u) => u.city === city)
                    .length;
                const shortage = Math.max(0, openUnits - donors);
                return { city, openUnits, donors, shortage };
            })
            .sort((a, b) => b.shortage - a.shortage);

        return rows;
    }, [state.requests, state.users]);

    const timeTrends = useMemo(() => {
        const last30 = Date.now() - 30 * DAY_MS;
        const rows = state.requests
            .map((r) => new Date(r.createdAt).getTime())
            .filter((t) => !Number.isNaN(t) && t >= last30);

        const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekday = Array.from({ length: 7 }, () => 0);
        const hourBinsLabels = ["0–3", "4–7", "8–11", "12–15", "16–19", "20–23"];
        const hourBins = Array.from({ length: 6 }, () => 0);

        for (const t of rows) {
            const d = new Date(t);
            weekday[d.getDay()] += 1;
            const hour = d.getHours();
            const idx = Math.min(5, Math.floor(hour / 4));
            hourBins[idx] += 1;
        }

        return {
            weekdayLabels,
            weekday,
            hourBinsLabels,
            hourBins,
        };
    }, [state.requests]);

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Analytics</CardTitle>
                        <CardMeta>
                            Blood group shortage, geographic insights, and time trends (mock)
                        </CardMeta>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <BarChartCard
                    title="Open Demand"
                    subtitle="Open request units by blood group"
                    labels={bloodGroupStats.labels}
                    data={bloodGroupStats.demand}
                    color="var(--danger)"
                />
                <BarChartCard
                    title="Available Supply"
                    subtitle="Available donors (not flagged) by blood group"
                    labels={bloodGroupStats.labels}
                    data={bloodGroupStats.supply}
                    color="var(--success)"
                />
            </div>

            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Blood Group Shortage</CardTitle>
                        <CardMeta>
                            Shortage = max(0, open units - available donors)
                        </CardMeta>
                    </div>
                    <Badge tone="warning">Open requests</Badge>
                </CardHeader>

                <Table>
                    <thead>
                        <tr>
                            <Th>Blood Group</Th>
                            <Th>Open Units</Th>
                            <Th>Available Donors</Th>
                            <Th>Shortage</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {bloodGroupStats.rows.map((r) => (
                            <tr
                                key={r.bg}
                                className="hover:bg-[var(--surface-2)]/60"
                            >
                                <Td className="font-semibold">{r.bg}</Td>
                                <Td>{r.demandUnits}</Td>
                                <Td>{r.supply}</Td>
                                <Td>
                                    <Badge
                                        tone={
                                            r.shortage >= 2
                                                ? "danger"
                                                : r.shortage === 1
                                                  ? "warning"
                                                  : "success"
                                        }
                                    >
                                        {r.shortage}
                                    </Badge>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Geographic Insights</CardTitle>
                        <CardMeta>
                            Heatmap-style view by city (open units vs available donors)
                        </CardMeta>
                    </div>
                    <Badge tone="info">Cities</Badge>
                </CardHeader>

                <Table>
                    <thead>
                        <tr>
                            <Th>City</Th>
                            <Th>Open Units</Th>
                            <Th>Available Donors</Th>
                            <Th>Shortage</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {geo.map((r) => (
                            <tr
                                key={r.city}
                                className="hover:bg-[var(--surface-2)]/60"
                            >
                                <Td className="font-semibold">{r.city}</Td>
                                <Td>{r.openUnits}</Td>
                                <Td>{r.donors}</Td>
                                <Td>
                                    <div
                                        className={
                                            "inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-semibold " +
                                            (r.shortage >= 2
                                                ? "bg-[var(--danger-bg)] text-[var(--danger)]"
                                                : r.shortage === 1
                                                  ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                                                  : "bg-[var(--success-bg)] text-[var(--success)]")
                                        }
                                    >
                                        {r.shortage}
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {geo.length === 0 ? (
                            <tr>
                                <Td colSpan={4} className="text-[var(--fg-2)]">
                                    No data.
                                </Td>
                            </tr>
                        ) : null}
                    </tbody>
                </Table>
            </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <BarChartCard
                    title="Requests by Weekday"
                    subtitle="Last 30 days"
                    labels={timeTrends.weekdayLabels}
                    data={timeTrends.weekday}
                    color="var(--info)"
                />
                <BarChartCard
                    title="Requests by Time"
                    subtitle="4-hour bins (last 30 days)"
                    labels={timeTrends.hourBinsLabels}
                    data={timeTrends.hourBins}
                    color="var(--primary)"
                />
            </div>
        </div>
    );
}
