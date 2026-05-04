import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Table, Td, Th } from "../components/ui/Table";

export function ReportsPage() {
    const exportUIOnly = (kind: string) => {
        window.alert(`${kind} export is not enabled in this mock dashboard.`);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Reports</CardTitle>
                        <CardMeta>Tables + export buttons (mock)</CardMeta>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => exportUIOnly("CSV")}
                        >
                            Export CSV
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => exportUIOnly("PDF")}
                        >
                            Export PDF
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Monthly Summary</CardTitle>
                        <CardMeta>Example aggregation</CardMeta>
                    </div>
                    <Badge tone="info">Mock</Badge>
                </CardHeader>

                <Table>
                    <thead>
                        <tr>
                            <Th>Month</Th>
                            <Th>Requests</Th>
                            <Th>Donations</Th>
                            <Th>Verified</Th>
                            <Th>Critical Alerts</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { m: "Jan", r: 120, d: 94, v: 83, c: 12 },
                            { m: "Feb", r: 140, d: 112, v: 98, c: 14 },
                            { m: "Mar", r: 155, d: 126, v: 109, c: 17 },
                        ].map((row) => (
                            <tr
                                key={row.m}
                                className="hover:bg-[var(--surface-2)]/60"
                            >
                                <Td className="font-semibold">{row.m}</Td>
                                <Td>{row.r}</Td>
                                <Td>{row.d}</Td>
                                <Td>{row.v}</Td>
                                <Td>{row.c}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Audit Trail</CardTitle>
                        <CardMeta>Verification/flagging activity</CardMeta>
                    </div>
                    <Badge tone="neutral">Mock</Badge>
                </CardHeader>

                <Table>
                    <thead>
                        <tr>
                            <Th>Time</Th>
                            <Th>Action</Th>
                            <Th>Actor</Th>
                            <Th>Target</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                t: "Today",
                                a: "Donation verified",
                                by: "Admin",
                                to: "d_2",
                            },
                            {
                                t: "Yesterday",
                                a: "User flagged",
                                by: "Admin",
                                to: "u_5",
                            },
                            {
                                t: "2 days ago",
                                a: "Request escalated",
                                by: "Admin",
                                to: "r_1",
                            },
                        ].map((row, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-[var(--surface-2)]/60"
                            >
                                <Td className="font-semibold">{row.t}</Td>
                                <Td>{row.a}</Td>
                                <Td>{row.by}</Td>
                                <Td>{row.to}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}
