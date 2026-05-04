import React, { useMemo, useState } from "react";
import { BLOOD_GROUPS } from "../data/constants";
import type { BloodBank } from "../data/types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Table, Td, Th } from "../components/ui/Table";
import { useAppStore } from "../store/AppStore";

function newId() {
    return `bb_${Math.random().toString(16).slice(2)}`;
}

export function BloodBanksPage() {
    const { state, actions } = useAppStore();

    const [editingId, setEditingId] = useState<string | null>(null);

    const editing = useMemo(
        () =>
            editingId
                ? (state.bloodBanks.find((b) => b.id === editingId) ?? null)
                : null,
        [editingId, state.bloodBanks],
    );

    const [form, setForm] = useState<BloodBank>({
        id: "",
        name: "",
        address: "",
        contact: "",
        city: "",
        state: "",
        groups: [],
        status: "active",
    });

    React.useEffect(() => {
        if (editing) setForm(editing);
        else {
            setForm({
                id: "",
                name: "",
                address: "",
                contact: "",
                city: "",
                state: "",
                groups: [],
                status: "active",
            });
        }
    }, [editing]);

    const submit = () => {
        if (
            !form.name.trim() ||
            !form.address.trim() ||
            !form.contact.trim() ||
            !form.city.trim() ||
            !form.state.trim()
        ) {
            window.alert("Please fill all required fields");
            return;
        }
        if (form.groups.length === 0) {
            window.alert("Select at least one blood group");
            return;
        }

        if (editing) {
            actions.updateBloodBank(form);
        } else {
            actions.createBloodBank({ ...form, id: newId() });
        }

        setEditingId(null);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Blood Banks</CardTitle>
                        <CardMeta>
                            Register + manage blood banks (mock)
                        </CardMeta>
                    </div>
                    <Badge tone="info">UI only</Badge>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>
                            {editing
                                ? "Edit Blood Bank"
                                : "Register Blood Bank"}
                        </CardTitle>
                        <CardMeta>Form updates local state only</CardMeta>
                    </div>
                    {editing ? (
                        <Button
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                        >
                            Cancel
                        </Button>
                    ) : null}
                </CardHeader>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input
                        value={form.name}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Name"
                    />
                    <Input
                        value={form.contact}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, contact: e.target.value }))
                        }
                        placeholder="Contact"
                    />
                    <Input
                        value={form.address}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, address: e.target.value }))
                        }
                        placeholder="Address"
                    />
                    <Input
                        value={form.city}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, city: e.target.value }))
                        }
                        placeholder="City"
                    />
                    <Input
                        value={form.state}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, state: e.target.value }))
                        }
                        placeholder="State"
                    />
                    <Select
                        value={form.status}
                        onChange={(e) =>
                            setForm((p) => ({
                                ...p,
                                status: e.target.value as any,
                            }))
                        }
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>

                <div className="mt-4">
                    <div className="text-xs font-semibold text-[var(--fg-2)]">
                        Supported Blood Groups
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {BLOOD_GROUPS.map((bg) => {
                            const checked = form.groups.includes(bg);
                            return (
                                <label
                                    key={bg}
                                    className={
                                        "cursor-pointer select-none rounded-full border px-3 py-1 text-xs font-semibold " +
                                        (checked
                                            ? "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]"
                                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-2)] hover:bg-[var(--surface-2)]")
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={checked}
                                        onChange={(e) => {
                                            setForm((p) => {
                                                const next = new Set(p.groups);
                                                if (e.target.checked)
                                                    next.add(bg);
                                                else next.delete(bg);
                                                return {
                                                    ...p,
                                                    groups: Array.from(
                                                        next,
                                                    ) as any,
                                                };
                                            });
                                        }}
                                    />
                                    {bg}
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <Button variant="primary" onClick={submit}>
                        {editing ? "Save Changes" : "Register"}
                    </Button>
                </div>
            </Card>

            <Table>
                <thead>
                    <tr>
                        <Th>Blood Bank</Th>
                        <Th>Location</Th>
                        <Th>Groups</Th>
                        <Th>Status</Th>
                        <Th className="text-right">Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {state.bloodBanks.map((b) => (
                        <tr
                            key={b.id}
                            className="hover:bg-[var(--surface-2)]/60"
                        >
                            <Td>
                                <div className="font-semibold">{b.name}</div>
                                <div className="text-xs text-[var(--fg-2)]">
                                    {b.contact}
                                </div>
                            </Td>
                            <Td>
                                <div className="font-medium">{b.city}</div>
                                <div className="text-xs text-[var(--fg-2)]">
                                    {b.state}
                                </div>
                            </Td>
                            <Td>
                                <div className="flex flex-wrap gap-1.5">
                                    {b.groups.map((bg) => (
                                        <Badge
                                            key={bg}
                                            tone="danger"
                                            className="bg-[var(--primary-soft)] text-[var(--primary)]"
                                        >
                                            {bg}
                                        </Badge>
                                    ))}
                                </div>
                            </Td>
                            <Td>
                                <Badge
                                    tone={
                                        b.status === "active"
                                            ? "success"
                                            : "neutral"
                                    }
                                    className="capitalize"
                                >
                                    {b.status}
                                </Badge>
                            </Td>
                            <Td className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setEditingId(b.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            actions.deleteBloodBank(b.id)
                                        }
                                    >
                                        Delete
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
