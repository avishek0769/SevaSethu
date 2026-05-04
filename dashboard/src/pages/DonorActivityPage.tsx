import { useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Table, Td, Th } from "../components/ui/Table";
import { LineChartCard } from "../components/charts/LineChartCard";
import { useAppStore } from "../store/AppStore";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

export function DonorActivityPage() {
    const { state } = useAppStore();

    const donors = useMemo(
        () => state.users.filter((u) => u.role === "donor"),
        [state.users],
    );

    const stats = useMemo(() => {
        const now = Date.now();
        const active7d = donors.filter(
            (u) => now - new Date(u.lastActiveAt).getTime() <= 7 * DAY_MS,
        ).length;
        const inactive30d = donors.filter(
            (u) => now - new Date(u.lastActiveAt).getTime() > 30 * DAY_MS,
        ).length;
        const flagged = donors.filter((u) => u.isFlagged).length;

        return {
            total: donors.length,
            active7d,
            inactive30d,
            flagged,
        };
    }, [donors]);

    const donationFrequency = useMemo(() => {
        const days = Array.from({ length: 14 }, (_, i) => {
            const d = startOfDay(new Date());
            d.setDate(d.getDate() - (13 - i));
            return d;
        });

        const labels = days.map((d) =>
            d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        );

        const data = days.map((d) => {
            const start = d.getTime();
            const end = start + DAY_MS;
            return state.donations.filter((don) => {
                const t = new Date(don.date).getTime();
                return t >= start && t < end;
            }).length;
        });

        return { labels, data };
    }, [state.donations]);

    const topDonors = useMemo(() => {
        const byName = new Map<
            string,
            {
                name: string;
                donations: number;
                verified: number;
                units: number;
                tokens: number;
                lastDonationAt: number | null;
            }
        >();

        for (const d of state.donations) {
            const current = byName.get(d.donorName) ?? {
                name: d.donorName,
                donations: 0,
                verified: 0,
                units: 0,
                tokens: 0,
                lastDonationAt: null as number | null,
            };

            const ts = new Date(d.date).getTime();
            current.donations += 1;
            current.verified += d.status === "verified" ? 1 : 0;
            current.units += d.units;
            current.tokens += d.tokens;
            current.lastDonationAt =
                current.lastDonationAt == null
                    ? ts
                    : Math.max(current.lastDonationAt, ts);

            byName.set(d.donorName, current);
        }

        const donorIndex = new Map(donors.map((u) => [u.name, u] as const));

        return Array.from(byName.values())
            .map((row) => {
                const u = donorIndex.get(row.name);
                return {
                    ...row,
                    bloodGroup: u?.bloodGroup ?? "—",
                    city: u?.city ?? "—",
                };
            })
            .sort((a, b) => {
                if (b.verified !== a.verified) return b.verified - a.verified;
                if (b.donations !== a.donations) return b.donations - a.donations;
                return (b.lastDonationAt ?? 0) - (a.lastDonationAt ?? 0);
            })
            .slice(0, 6);
    }, [donors, state.donations]);

    const recentlyActive = useMemo(() => {
        return [...donors]
            .sort(
                (a, b) =>
                    new Date(b.lastActiveAt).getTime() -
                    new Date(a.lastActiveAt).getTime(),
            )
            .slice(0, 6);
    }, [donors]);

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Donor Activity Tracking</CardTitle>
                        <CardMeta>
                            Activity snapshots from donors + donation records (mock)
                        </CardMeta>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Total Donors</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.total}
                            </CardTitle>
                        </div>
                        <Badge tone="info">Mock</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Donor accounts in the system.
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Active (7d)</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.active7d}
                            </CardTitle>
                        </div>
                        <Badge tone="success">Recent</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Donors seen active in the last week.
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Inactive (30d+)</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.inactive30d}
                            </CardTitle>
                        </div>
                        <Badge tone="warning">Watch</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Candidates for re-engagement campaigns.
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardMeta>Flagged Donors</CardMeta>
                            <CardTitle className="text-2xl">
                                {stats.flagged}
                            </CardTitle>
                        </div>
                        <Badge tone="danger">Review</Badge>
                    </CardHeader>
                    <div className="text-sm text-[var(--fg-2)]">
                        Flagged for admin review.
                    </div>
                </Card>
            </div>

            <LineChartCard
                title="Donation Frequency"
                subtitle="Donations per day (last 14 days)"
                labels={donationFrequency.labels}
                data={donationFrequency.data}
                color="var(--primary)"
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Most Active Donors</CardTitle>
                            <CardMeta>
                                Ranked by verified donations, then total donations
                            </CardMeta>
                        </div>
                        <Badge tone="info">Top</Badge>
                    </CardHeader>

                    <Table>
                        <thead>
                            <tr>
                                <Th>Donor</Th>
                                <Th>Blood</Th>
                                <Th>City</Th>
                                <Th>Verified</Th>
                                <Th>Total</Th>
                                <Th>Tokens</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDonors.map((d) => (
                                <tr
                                    key={d.name}
                                    className="hover:bg-[var(--surface-2)]/60"
                                >
                                    <Td className="font-semibold">{d.name}</Td>
                                    <Td>{d.bloodGroup}</Td>
                                    <Td>{d.city}</Td>
                                    <Td>{d.verified}</Td>
                                    <Td>{d.donations}</Td>
                                    <Td>{d.tokens}</Td>
                                </tr>
                            ))}
                            {topDonors.length === 0 ? (
                                <tr>
                                    <Td colSpan={6} className="text-[var(--fg-2)]">
                                        No donation records yet.
                                    </Td>
                                </tr>
                            ) : null}
                        </tbody>
                    </Table>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Recently Active Donors</CardTitle>
                            <CardMeta>Based on last active timestamp</CardMeta>
                        </div>
                        <Badge tone="success">Now</Badge>
                    </CardHeader>

                    <Table>
                        <thead>
                            <tr>
                                <Th>Donor</Th>
                                <Th>Blood</Th>
                                <Th>Location</Th>
                                <Th>Status</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentlyActive.map((u) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-[var(--surface-2)]/60"
                                >
                                    <Td>
                                        <div className="font-semibold">{u.name}</div>
                                        <div className="text-xs text-[var(--fg-2)]">
                                            Last active{" "}
                                            {new Date(u.lastActiveAt).toLocaleString()}
                                        </div>
                                    </Td>
                                    <Td>{u.bloodGroup}</Td>
                                    <Td>
                                        {u.city} • {u.locationLabel}
                                    </Td>
                                    <Td>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {u.isAvailable ? (
                                                <Badge tone="success">Available</Badge>
                                            ) : (
                                                <Badge tone="neutral">Unavailable</Badge>
                                            )}
                                            {u.isFlagged ? (
                                                <Badge tone="danger">Flagged</Badge>
                                            ) : null}
                                        </div>
                                    </Td>
                                </tr>
                            ))}
                            {recentlyActive.length === 0 ? (
                                <tr>
                                    <Td colSpan={4} className="text-[var(--fg-2)]">
                                        No donor accounts.
                                    </Td>
                                </tr>
                            ) : null}
                        </tbody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
