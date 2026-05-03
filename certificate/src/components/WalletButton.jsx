// src/components/WalletButton.jsx

import styles from "./WalletButton.module.css";

export default function WalletButton({
    wallet,
    shortAddr,
    loading,
    error,
    onConnect,
}) {
    return (
        <div className={styles.row}>
            <span className={styles.label}>🔗 Blockchain Wallet</span>

            {!wallet ? (
                <button
                    className={styles.btn}
                    onClick={onConnect}
                    disabled={loading}
                >
                    {loading ? "⏳ Connecting..." : "🦊 Connect MetaMask"}
                </button>
            ) : (
                <div className={styles.connected}>
                    <span className={styles.dot} />
                    <span className={styles.addr}>{shortAddr}</span>
                    <span className={styles.network}>Polygon Amoy</span>
                </div>
            )}

            {error && <p className={styles.error}>⚠️ {error}</p>}

            {!window.ethereum && (
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.install}
                >
                    Install MetaMask →
                </a>
            )}
        </div>
    );
}
