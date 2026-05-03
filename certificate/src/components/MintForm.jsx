// src/components/MintForm.jsx

import { useState } from "react";

const FIELD = {
    background: "#1a080e",
    border: "1px solid #3a1a20",
    borderRadius: 6,
    padding: "9px 12px",
    color: "#f0e0e4",
    fontSize: 13,
    fontFamily: "'DM Sans',sans-serif",
    outline: "none",
    width: "100%",
};

export default function MintForm({ onMint, disabled }) {
    const [form, setForm] = useState({
        donorName: "",
        bloodType: "O+",
        hospital: "",
        city: "",
        doctorName: "",
        donationDate: new Date().toISOString().split("T")[0],
        units: 450,
    });

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = () => {
        if (!form.donorName || !form.hospital || !form.donationDate) {
            alert("Please fill: Name, Hospital, Date");
            return;
        }
        onMint(form);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div
                style={{
                    fontSize: 11,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#a07080",
                    marginBottom: 12,
                    fontFamily: "'Share Tech Mono',monospace",
                }}
            >
                Donor Information
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 10,
                }}
            >
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        Full Name *
                    </label>
                    <input
                        style={FIELD}
                        placeholder="e.g. Rahul Sharma"
                        value={form.donorName}
                        onChange={(e) => set("donorName", e.target.value)}
                    />
                </div>
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        Blood Type *
                    </label>
                    <select
                        style={FIELD}
                        value={form.bloodType}
                        onChange={(e) => set("bloodType", e.target.value)}
                    >
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                            (b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ),
                        )}
                    </select>
                </div>
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        Hospital *
                    </label>
                    <input
                        style={FIELD}
                        placeholder="e.g. Apollo Hospital"
                        value={form.hospital}
                        onChange={(e) => set("hospital", e.target.value)}
                    />
                </div>
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        City
                    </label>
                    <input
                        style={FIELD}
                        placeholder="e.g. Kolkata"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                    />
                </div>
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        Doctor / Verified By
                    </label>
                    <input
                        style={FIELD}
                        placeholder="e.g. Dr. Meera Nair"
                        value={form.doctorName}
                        onChange={(e) => set("doctorName", e.target.value)}
                    />
                </div>
                <div>
                    <label
                        style={{
                            fontSize: 12,
                            color: "#a07080",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        Donation Date *
                    </label>
                    <input
                        style={FIELD}
                        type="date"
                        value={form.donationDate}
                        onChange={(e) => set("donationDate", e.target.value)}
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={disabled}
                style={{
                    width: "100%",
                    padding: 14,
                    background: disabled
                        ? "#3a1a20"
                        : "linear-gradient(135deg,#8b0000,#c0392b,#8b0000)",
                    border: "none",
                    borderRadius: 8,
                    color: disabled ? "#7a5060" : "#fff",
                    fontSize: 15,
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 600,
                    cursor: disabled ? "not-allowed" : "pointer",
                    letterSpacing: ".08em",
                    transition: "all .3s",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {disabled ? "⏳ Minting..." : "🏆 Mint NFT Certificate"}
            </button>

            {!disabled && (
                <p
                    style={{
                        fontSize: 11,
                        color: "#a07080",
                        marginTop: 8,
                        fontFamily: "'Share Tech Mono',monospace",
                        letterSpacing: ".03em",
                    }}
                >
                    ⛽ Requires small MATIC gas fee on Polygon Amoy testnet
                </p>
            )}
        </div>
    );
}
