// src/App.jsx
// Main app — wires all components + hooks together

import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import WalletButton from "./components/WalletButton";
import MintForm from "./components/MintForm";
import MintLoader from "./components/MintLoader";
import Certificate from "./components/Certificate";
import DonationHistory from "./components/DonationHistory";
import Confetti from "./components/Confetti";

export default function App() {
    const {
        provider,
        signer,
        wallet,
        shortAddr,
        loading: walletLoading,
        error: walletError,
        connect,
    } = useWallet();

    const {
        mint,
        fetchDonations,
        minting,
        txHash,
        tokenId,
        step,
        error: mintError,
    } = useContract(signer);

    const [certData, setCertData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const handleMint = async (formData) => {
        if (!wallet) {
            showToast("🦊 Connect MetaMask first!");
            return;
        }
        try {
            const result = await mint(formData);
            setCertData({ ...formData, ...result });
            setShowConfetti(true);
            showToast("🏆 NFT minted on Polygon!");
            setTimeout(() => setShowConfetti(false), 4000);
        } catch (err) {
            if (!err.message?.includes("rejected")) {
                showToast("❌ " + (err.message || "Mint failed"));
            }
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(160deg,#0a0608 0%,#100510 100%)",
                padding: "24px 16px",
            }}
        >
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
                {/* ── HEADER ── */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#e74c3c",
                            letterSpacing: ".06em",
                        }}
                    >
                        🩸 LifeLine
                    </div>
                    <div
                        style={{
                            fontSize: 11,
                            fontFamily: "'Share Tech Mono',monospace",
                            color: "#a07080",
                            letterSpacing: ".22em",
                            marginTop: 3,
                        }}
                    >
                        NFT BLOOD DONATION CERTIFICATE
                    </div>
                </div>

                {/* ── WALLET ── */}
                <WalletButton
                    wallet={wallet}
                    shortAddr={shortAddr}
                    loading={walletLoading}
                    error={walletError}
                    onConnect={connect}
                />

                <div
                    style={{
                        height: 1,
                        background:
                            "linear-gradient(90deg,transparent,#3a1510,transparent)",
                        margin: "20px 0",
                    }}
                />

                {/* ── MINT FORM ── */}
                {!minting && !certData && (
                    <MintForm onMint={handleMint} disabled={minting} />
                )}

                {/* ── LOADING ── */}
                {minting && <MintLoader step={step} txHash={txHash} />}

                {/* ── MINT ERROR ── */}
                {mintError && (
                    <div
                        style={{
                            background: "#1a0608",
                            border: "1px solid #c0392b",
                            borderRadius: 8,
                            padding: "12px 16px",
                            marginBottom: 16,
                            color: "#f5a0b0",
                            fontSize: 13,
                            fontFamily: "'Share Tech Mono',monospace",
                        }}
                    >
                        ❌ {mintError}
                    </div>
                )}

                {/* ── CERTIFICATE ── */}
                {certData && !minting && (
                    <>
                        <Certificate
                            data={certData}
                            tokenId={tokenId || certData.tokenId}
                            txHash={txHash || certData.txHash}
                            wallet={wallet}
                        />
                        <button
                            onClick={() => setCertData(null)}
                            style={{
                                background: "transparent",
                                border: "1px solid #3a1a20",
                                borderRadius: 6,
                                color: "#a07080",
                                padding: "8px 16px",
                                fontSize: 12,
                                cursor: "pointer",
                                marginBottom: 20,
                                fontFamily: "'Share Tech Mono',monospace",
                            }}
                        >
                            + Mint Another Certificate
                        </button>
                    </>
                )}

                <div
                    style={{
                        height: 1,
                        background:
                            "linear-gradient(90deg,transparent,#3a1510,transparent)",
                        margin: "8px 0 20px",
                    }}
                />

                {/* ── DONATION HISTORY (from blockchain) ── */}
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
                    ⛓️ Your On-Chain Donation History
                </div>
                <DonationHistory
                    fetchDonations={fetchDonations}
                    provider={provider}
                    wallet={wallet}
                />
            </div>

            {/* ── CONFETTI ── */}
            <Confetti active={showConfetti} />

            {/* ── TOAST ── */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#1a080e",
                        border: "1px solid #c0392b",
                        borderRadius: 8,
                        padding: "12px 20px",
                        color: "#f5a0b0",
                        fontSize: 13,
                        fontFamily: "'Share Tech Mono',monospace",
                        zIndex: 1000,
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 24px rgba(192,57,43,.3)",
                        animation: "fadeUp .3s ease",
                    }}
                >
                    {toast}
                </div>
            )}
        </div>
    );
}
