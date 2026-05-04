import { useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Table, Td, Th } from "../components/ui/Table";
import type { Donation } from "../data/types";
import { useAppStore } from "../store/AppStore";

function tone(status: Donation["status"]): Parameters<typeof Badge>[0]["tone"] {
    if (status === "verified") return "success";
    if (status === "rejected") return "danger";
    return "warning";
}

export function DonationsPage() {
    const { state, actions } = useAppStore();
    const [draftTokens, setDraftTokens] = useState<Record<string, string>>({});

    const rows = useMemo(() => state.donations, [state.donations]);

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Donations</CardTitle>
                        <CardMeta>
                            Verify / reject and adjust reward tokens (UI only)
                        </CardMeta>
                    </div>
                    <Badge tone="info">{rows.length} records</Badge>
                </CardHeader>
            </Card>

            <Table>
                <thead>
                    <tr>
                        <Th>Donation</Th>
                        <Th>Blood</Th>
                        <Th>Status</Th>
                        <Th>Tokens</Th>
                        <Th className="text-right">Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((d) => (
                        <tr
                            key={d.id}
                            className="hover:bg-[var(--surface-2)]/60"
                        >
                            <Td>
                                <div className="font-semibold">
                                    {d.donorName}
                                </div>
                                <div className="text-xs text-[var(--fg-2)]">
                                    Request {d.requestId} •{" "}
                                    {new Date(d.date).toLocaleDateString()}
                                </div>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        tone="danger"
                                        className="bg-[var(--primary-soft)] text-[var(--primary)]"
                                    >
                                        {d.bloodGroup}
                                    </Badge>
                                    <span className="text-sm text-[var(--fg-2)]">
                                        {d.units} unit(s)
                                    </span>
                                </div>
                            </Td>
                            <Td>
                                <Badge
                                    tone={tone(d.status)}
                                    className="capitalize"
                                >
                                    {d.status}
                                </Badge>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-2">
                                    <div className="min-w-[70px] text-sm font-semibold">
                                        {d.tokens}
                                    </div>
                                    <Input
                                        className="w-28"
                                        value={draftTokens[d.id] ?? ""}
                                        onChange={(e) =>
                                            setDraftTokens((p) => ({
                                                ...p,
                                                [d.id]: e.target.value,
                                            }))
                                        }
                                        placeholder="Set…"
                                        inputMode="numeric"
                                    />
                                </div>
                            </Td>
                            <Td className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() =>
                                            actions.setDonationStatus(
                                                d.id,
                                                "verified",
                                            )
                                        }
                                    >
                                        Verify
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            actions.setDonationStatus(
                                                d.id,
                                                "rejected",
                                            )
                                        }
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            const v = Number(draftTokens[d.id]);
                                            if (!Number.isFinite(v) || v < 0) {
                                                window.alert(
                                                    "Enter a valid token number",
                                                );
                                                return;
                                            }
                                            actions.adjustDonationTokens(
                                                d.id,
                                                v,
                                            );
                                            setDraftTokens((p) => ({
                                                ...p,
                                                [d.id]: "",
                                            }));
                                        }}
                                    >
                                        Apply Tokens
                                    </Button>
                                </div>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
