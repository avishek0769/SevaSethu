import { ethers } from "ethers";
import puppeteer from "puppeteer";
import Donation from "../models/donation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ABI from "../utils/LifelineCert.js";

const downloadCertificate = asyncHandler(async (req, res) => {
    const donationId = req.params.donationId;
    
    // 1. Fetch donation and ensure it's confirmed
    const donation = await Donation.findById(donationId).populate("user");
    if (!donation) throw new ApiError(404, "Donation not found");
    if (donation.status !== "completed") {
        throw new ApiError(400, "Donation is not completed yet");
    }
    if (donation.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to download this certificate");
    }

    // 2. Mint the NFT if not already minted
    if (!donation.certificateMinted) {
        try {
            const RPC_URL = process.env.WEB3_RPC_URL || "http://127.0.0.1:8586";
            const PRIVATE_KEY = process.env.WEB3_PRIVATE_KEY;
            const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

            if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
                throw new Error("Web3 configuration missing in backend .env");
            }

            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

            const tokenURI = `https://r51klsgs-3000.inc1.devtunnels.ms/certificate/${donationId}`;
            const donationDateUnix = Math.floor(new Date(donation.confirmedAt || Date.now()).getTime() / 1000);

            // Call the selfMintCertificate function
            const tx = await contract.selfMintCertificate(
                donation.donorName || donation.user.name,
                donation.bloodGroup,
                donation.hospital || "SevaSethu Hospital",
                donation.user.city || "Unknown",
                donation.requesterName || "Verified Doctor",
                donationDateUnix,
                donation.units || 1,
                tokenURI
            );

            const receipt = await tx.wait();
            
            // Extract the tokenId from the CertificateMinted event
            let tokenId = "N/A";
            for (const log of receipt.logs) {
                try {
                    const parsedLog = contract.interface.parseLog(log);
                    if (parsedLog && parsedLog.name === "CertificateMinted") {
                        tokenId = parsedLog.args[0].toString();
                    }
                } catch (e) {
                    // Ignore parsing errors for other logs
                }
            }

            // Update donation record
            donation.certificateMinted = true;
            donation.certificateTxHash = receipt.hash;
            donation.certificateTokenId = tokenId;
            await donation.save();
        } catch (error) {
            console.error("Minting failed:", error);
            throw new ApiError(500, "Failed to mint certificate on the blockchain");
        }
    }

    // 3. Generate PDF using Puppeteer with exact frontend layout
    const fmt = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const shortTx = donation.certificateTxHash ? donation.certificateTxHash.slice(0, 14) + '...' + donation.certificateTxHash.slice(-8) : '—';
    const shortWal = process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS.slice(0, 10) + '...' + process.env.CONTRACT_ADDRESS.slice(-8) : '—';
    
    const htmlContent = `
      <!DOCTYPE html>
        <html>
        <head>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
        <style>
            /* Strict A4 Formatting */
            @page {
            size: A4;
            margin: 0;
            }
            body { 
            background: #ffffff; 
            margin: 0; 
            padding: 0; 
            color: #1a1a1a; 
            font-family: sans-serif;
            -webkit-print-color-adjust: exact;
            }

            .cert-container { 
            width: 210mm; 
            height: 297mm; 
            padding: 15mm; 
            box-sizing: border-box;
            position: relative;
            overflow: hidden; /* Prevents vertical overflow */
            display: flex;
            flex-direction: column;
            }

            /* Status Badges */
            .status-badges { 
            display: flex; 
            gap: 10px; 
            margin-bottom: 20px; 
            justify-content: center;
            }
            .badge { 
            border-radius: 4px; 
            padding: 5px 12px; 
            font-size: 11px; 
            font-family: 'Share Tech Mono', monospace; 
            border: 1px solid #ccc;
            }
            .badge-verified { background: #e8f5e9; border-color: #2e7d32; color: #2e7d32; }
            .badge-erc { background: #f3e5f5; border-color: #7b1fa2; color: #7b1fa2; }
            .badge-token { background: #fff8e1; border-color: #fbc02d; color: #9a7d0a; }

            /* Main Border */
            .gold-border-wrapper { 
            height: 250mm; /* Fixed height to ensure it fits A4 */
            padding: 8px; 
            border: 2px solid #d4af37;
            position: relative;
            }

            .cert-body { 
            height: 100%;
            border: 1px solid #d4af37;
            padding: 40px 45px; 
            position: relative; 
            box-sizing: border-box;
            }

            .watermark-img { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            width: 350px;
            opacity: 0.04; 
            z-index: 0;
            }

            .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 1px solid #eee; 
            padding-bottom: 20px; 
            }
            .header-sub { 
            font-family: 'Cinzel', serif; 
            font-size: 13px; 
            letter-spacing: 0.4em; 
            color: #d4af37; 
            }
            .header-title { 
            font-family: 'Cinzel', serif; 
            font-size: 36px; 
            margin: 15px 0;
            color: #1a1a1a; 
            }

            /* Single Line Donor Info */
            .donor-section {
            text-align: center;
            margin-bottom: 40px;
            }
            .field-label { 
            font-size: 11px; 
            color: #888; 
            font-family: 'Share Tech Mono', monospace; 
            letter-spacing: 0.2em; 
            text-transform: uppercase; 
            margin-bottom: 8px; 
            }
            .donor-name {
            font-family: 'Cinzel', serif;
            font-size: 32px;
            font-weight: 700;
            color: #c0392b;
            border-bottom: 1px solid #f0f0f0;
            display: inline-block;
            padding: 0 20px 30px 20px;
            }

            .grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 25px 40px; 
            margin-bottom: 4rem;
            margin-top: 4rem;
            }

            .data-value {
            font-size: 16px; 
            font-weight: 600;
            color: #333;
            }

            .chain-box { 
            background: #fcfcfc; 
            padding: 20px; 
            border: 1px solid #efefef; 
            }
            .chain-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            }
            .chain-label { font-size: 10px; font-family: 'Share Tech Mono', monospace; color: #999; }
            .chain-val { font-size: 11px; font-family: 'Share Tech Mono', monospace; color: #1a1a1a; }

            .footer { 
            position: absolute;
            bottom: 30px;
            left: 45px;
            right: 45px;
            display: flex; 
            justify-content: space-between; 
            border-top: 1px solid #eee;
            padding-top: 15px;
            }
            .footer-text { 
            font-size: 10px; 
            font-family: 'Share Tech Mono', monospace; 
            color: #aaa; 
            }
        </style>
        </head>
        <body>
        <div class="cert-container">
            <div class="status-badges">
            <span class="badge badge-verified">✔ Polygon Verified</span>
            <span class="badge badge-erc">◆ ERC-721 NFT</span>
            <span class="badge badge-token">Token #${donation.certificateTokenId}</span>
            </div>

            <div class="gold-border-wrapper">
            <div class="cert-body">
                <img src="your-image-path.png" class="watermark-img" alt="Watermark">

                <div class="header">
                <div class="header-sub">✦ SEVASETHU BLOOD NETWORK ✦</div>
                <h1 class="header-title">Certificate of Donation</h1>
                </div>

                <div class="donor-section">
                <div class="field-label">Honoring Donor</div>
                <div class="donor-name">${donation.donorName || donation.user.name}</div>
                </div>

                <div class="grid">
                <div>
                    <div class="field-label">Hospital / Center</div>
                    <div class="data-value">${donation.hospital || "SevaSethu Hospital"}</div>
                </div>
                <div>
                    <div class="field-label">Location</div>
                    <div class="data-value">${donation.user.city || "Unknown"}</div>
                </div>
                <div>
                    <div class="field-label">Date of Donation</div>
                    <div class="data-value">${fmt(donation.confirmedAt || Date.now())}</div>
                </div>
                <div>
                    <div class="field-label">Medical Verification</div>
                    <div class="data-value">${donation.requesterName || "Certified Doctor"}</div>
                </div>
                <div>
                    <div class="field-label">Volume Donated</div>
                    <div class="data-value">${donation.units * 450 || 450} ml (1 Unit)</div>
                </div>
                <div>
                    <div class="field-label">Wallet Address</div>
                    <div class="data-value" style="font-size: 11px; font-family: 'Share Tech Mono'; color: #d4af37;">${shortWal}</div>
                </div>
                </div>

                <div class="chain-box">
                <div class="chain-row">
                    <span class="chain-label">Transaction Hash</span>
                    <span class="chain-val">${shortTx}</span>
                </div>
                <div class="chain-row">
                    <span class="chain-label">Blockchain Network</span>
                    <span class="chain-val">Polygon Mainnet (Amoy Testnet)</span>
                </div>
                <div class="chain-row">
                    <span class="chain-label">Smart Contract</span>
                    <span class="chain-val">0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
                </div>
                <div class="chain-row">
                    <span class="chain-label">Integrity Status</span>
                    <span class="chain-val">Immutable Ledger · IPFS Encoded</span>
                </div>
                </div>

                <div class="footer">
                <div class="footer-text">
                    Verified via SevaSethu Smart Contract v1.0.0
                </div>
                <div class="footer-text" style="text-align: right;">
                    Official Humanitarian Record<br>
                    Secure · Lifesaving · Permanent
                </div>
                </div>
            </div>
            </div>
        </div>
        </body>
        </html>
    `;

    try {
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=SevaSethu_Certificate_${donationId}.pdf`);
        res.end(pdfBuffer);
    } catch (pdfError) {
        console.error("PDF generation failed:", pdfError);
        throw new ApiError(500, "Failed to generate PDF certificate");
    }
});

export { downloadCertificate };
