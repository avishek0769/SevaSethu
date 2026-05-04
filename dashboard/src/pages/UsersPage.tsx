import { useMemo, useState } from "react";
import { BLOOD_GROUPS } from "../data/constants";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Table, Td, Th } from "../components/ui/Table";
import { useAppStore } from "../store/AppStore";

export function UsersPage() {
  const { state, actions } = useAppStore();

  const [q, setQ] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const locations = useMemo(() => {
    const set = new Set(state.users.map((u) => u.city));
    return Array.from(set);
  }, [state.users]);

  const filtered = useMemo(() => {
    return state.users.filter((u) => {
      if (q.trim()) {
        const s = q.trim().toLowerCase();
        if (!u.name.toLowerCase().includes(s) && !u.locationLabel.toLowerCase().includes(s)) return false;
      }
      if (bloodGroup !== "all" && u.bloodGroup !== bloodGroup) return false;
      if (location !== "all" && u.city !== location) return false;
      if (availability !== "all") {
        const want = availability === "available";
        if (u.isAvailable !== want) return false;
      }
      return true;
    });
  }, [state.users, q, bloodGroup, location, availability]);

  const selected = useMemo(() => state.users.find((u) => u.id === selectedId) ?? null, [state.users, selectedId]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Filters</CardTitle>
            <CardMeta>Search and refine users (mock data)</CardMeta>
          </div>
          <Badge tone="info">{filtered.length} results</Badge>
        </CardHeader>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or area…" />
          <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
            <option value="all">All blood groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="all">All cities</option>
            {locations.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="all">All availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </Select>
        </div>
      </Card>

      <Table>
        <thead>
          <tr>
            <Th>User</Th>
            <Th>Role</Th>
            <Th>Blood</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="hover:bg-[var(--surface-2)]/60">
              <Td>
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-[var(--fg-2)]">Last active {new Date(u.lastActiveAt).toLocaleDateString()}</div>
              </Td>
              <Td className="capitalize text-[var(--fg-2)]">{u.role}</Td>
              <Td>
                <Badge tone="danger" className="bg-[var(--primary-soft)] text-[var(--primary)]">
                  {u.bloodGroup}
                </Badge>
              </Td>
              <Td>
                <div className="font-medium">{u.city}</div>
                <div className="text-xs text-[var(--fg-2)]">{u.locationLabel}</div>
              </Td>
              <Td>
                <div className="flex flex-wrap items-center gap-2">
                  {u.isAvailable ? <Badge tone="success">Available</Badge> : <Badge tone="neutral">Unavailable</Badge>}
                  {u.isVerified ? <Badge tone="info">Verified</Badge> : <Badge tone="warning">Unverified</Badge>}
                  {u.isFlagged ? <Badge tone="danger">Flagged</Badge> : null}
                </div>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(u.id)}>
                    View
                  </Button>
                  <Button variant={u.isVerified ? "secondary" : "primary"} size="sm" onClick={() => actions.verifyUser(u.id)}>
                    {u.isVerified ? "Unverify" : "Verify"}
                  </Button>
                  <Button variant={u.isFlagged ? "secondary" : "danger"} size="sm" onClick={() => actions.flagUser(u.id)}>
                    {u.isFlagged ? "Unflag" : "Flag"}
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
              <CardTitle>User Details</CardTitle>
              <CardMeta>{selected.id}</CardMeta>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
              Close
            </Button>
          </CardHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Name</div>
              <div className="mt-1 text-sm font-semibold">{selected.name}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Blood Group</div>
              <div className="mt-1 text-sm font-semibold">{selected.bloodGroup}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--fg-2)]">Location</div>
              <div className="mt-1 text-sm font-semibold">{selected.city} • {selected.locationLabel}</div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
