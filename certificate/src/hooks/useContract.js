// src/hooks/useContract.js
// Calls the REAL smart contract on Polygon using ethers.js v6

import { useState, useCallback } from "react";
import { Contract } from "ethers";
import ABI from "../abi/LifelineCert";

// ─── After deploying, paste your contract address in .env ───────
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function useContract(signer) {
    const [minting, setMinting] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(null);
    // step values: 'signing' | 'broadcasting' | 'confirming' | 'done'

    // ── MINT a new NFT certificate ──────────────────────────────
    const mint = useCallback(
        async (formData) => {
            if (!signer) throw new Error("Wallet not connected");
            if (!CONTRACT_ADDRESS)
                throw new Error("Contract address not set in .env");

            setMinting(true);
            setError(null);
            setTxHash(null);
            setTokenId(null);

            try {
                // 1. Connect to contract with signer (needed to write)
                const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

                // 2. Build metadata URI
                //    For demo: use a data-URI JSON (no IPFS needed)
                //    For production: upload to IPFS first, use that URI
                const metadata = {
                    name: `LifeLine Donation #${Date.now()}`,
                    description: `Blood donation certificate for ${formData.donorName}`,
                    image: "https://lifeline.app/nft-image.png", // replace with real IPFS image
                    attributes: [
                        { trait_type: "Blood Type", value: formData.bloodType },
                        { trait_type: "Hospital", value: formData.hospital },
                        { trait_type: "City", value: formData.city },
                        { trait_type: "Units (ml)", value: formData.units },
                        { trait_type: "Verified", value: "Self-declared" },
                    ],
                };
                const tokenURI =
                    "data:application/json;base64," +
                    btoa(JSON.stringify(metadata));

                // 3. Call contract — MetaMask pops up here for user to sign
                setStep("signing");
                const donationTimestamp = Math.floor(
                    new Date(formData.donationDate).getTime() / 1000,
                );

                const tx = await contract.selfMintCertificate(
                    formData.donorName,
                    formData.bloodType,
                    formData.hospital,
                    formData.city || "",
                    formData.doctorName || "",
                    donationTimestamp,
                    formData.units || 450,
                    tokenURI,
                );

                // 4. Transaction broadcast to Polygon network
                setStep("broadcasting");
                setTxHash(tx.hash);

                // 5. Wait for blockchain confirmation (1 block)
                setStep("confirming");
                const receipt = await tx.wait(1);

                // 6. Extract tokenId from event logs
                const mintEvent = receipt.logs.find((log) => {
                    try {
                        const parsed = contract.interface.parseLog(log);
                        return parsed?.name === "CertificateMinted";
                    } catch {
                        return false;
                    }
                });

                let newTokenId = null;
                if (mintEvent) {
                    const parsed = contract.interface.parseLog(mintEvent);
                    newTokenId = parsed.args.tokenId.toString();
                    setTokenId(newTokenId);
                }

                setStep("done");
                return { txHash: tx.hash, tokenId: newTokenId, receipt };
            } catch (err) {
                // User rejected in MetaMask
                if (err.code === 4001 || err.code === "ACTION_REJECTED") {
                    setError("Transaction rejected by user");
                } else {
                    setError(err.message || "Minting failed");
                }
                throw err;
            } finally {
                setMinting(false);
            }
        },
        [signer],
    );

    // ── READ all donations for a wallet ────────────────────────
    const fetchDonations = useCallback(async (provider, walletAddress) => {
        if (!provider || !walletAddress || !CONTRACT_ADDRESS) return [];

        try {
            // Read-only contract (no signer needed)
            const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
            const tokenIds = await contract.getDonorTokens(walletAddress);

            // Fetch each record
            const records = await Promise.all(
                tokenIds.map(async (id) => {
                    const rec = await contract.getDonationRecord(id);
                    return {
                        tokenId: id.toString(),
                        donorName: rec.donorName,
                        bloodType: rec.bloodType,
                        hospital: rec.hospital,
                        city: rec.city,
                        doctorName: rec.doctorName,
                        donationDate: new Date(Number(rec.donationDate) * 1000),
                        units: Number(rec.units),
                        verified: rec.verified,
                    };
                }),
            );
            return records.reverse(); // newest first
        } catch (err) {
            console.error("fetchDonations error:", err);
            return [];
        }
    }, []);

    return {
        mint,
        fetchDonations,
        minting,
        txHash,
        tokenId,
        step,
        error,
    };
}
