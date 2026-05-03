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
          body { background: transparent; margin: 0; padding: 20px; color: #f0e0e4; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .cert-container { width: 100%; max-width: 680px; }
          .status-badges { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
          .badge { display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-family: 'Share Tech Mono', monospace; }
          .badge-verified { background: #071a0e; border: 1px solid #1a6b35; color: #2ecc71; }
          .badge-erc { background: #150a1a; border: 1px solid #4a2a6a; color: #a855f7; }
          .badge-token { background: #1a1205; border: 1px solid #d4af37; color: #d4af37; }
          .gold-wrapper { padding: 3px; border-radius: 14px; background: linear-gradient(135deg,#d4af37,#8b0000,#d4af37,#8b0000,#d4af37); }
          .cert-body { background: linear-gradient(160deg,#130810 0%,#0d0508 50%,#130810 100%); border-radius: 12px; padding: 28px 28px 22px; position: relative; overflow: hidden; }
          .watermark { position: absolute; font-size: 160px; opacity: 0.04; top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; user-select: none; line-height: 1; }
          .header { text-align: center; margin-bottom: 22px; border-bottom: 1px solid #3a1510; padding-bottom: 16px; }
          .header-sub { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.3em; color: #d4af37; margin-bottom: 6px; }
          .header-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; color: #f5d76e; letter-spacing: 0.1em; }
          .header-meta { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #a07080; letter-spacing: 0.15em; margin-top: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 20px; }
          .field-label { font-size: 10px; color: #a07080; font-family: 'Share Tech Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
          .chain-box { background: #0a0306; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; border: 1px solid #2a0f16; }
          .chain-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
          .chain-label { font-size: 10px; font-family: 'Share Tech Mono', monospace; color: #a07080; letter-spacing: 0.08em; }
          .chain-val { font-size: 11px; font-family: 'Share Tech Mono', monospace; color: #d4af37; }
          .footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
          .footer-text { font-size: 10px; font-family: 'Share Tech Mono', monospace; color: #5a3040; text-align: right; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="status-badges">
            <span class="badge badge-verified">✔ Verified on Polygon</span>
            <span class="badge badge-erc">◆ ERC-721 NFT</span>
            <span class="badge badge-token">Token #${donation.certificateTokenId}</span>
          </div>
          <div class="gold-wrapper">
            <div class="cert-body">
              <div class="watermark">🩸</div>
              <div class="header">
                <div class="header-sub">✦ LIFELINE BLOOD NETWORK ✦</div>
                <div class="header-title">Official Donor Certificate</div>
                <div class="header-meta">Blockchain Verified · Immutable Record</div>
              </div>
              <div class="grid">
                <div><div class="field-label">Donor Name</div><div style="font-size:22px; font-weight:700; font-family:'Cinzel',serif; color:#e74c3c; word-break:break-all;">${donation.donorName || donation.user.name}</div></div>
                <div><div class="field-label">Blood Type</div><div style="font-size:22px; font-weight:700; font-family:'Cinzel',serif; color:#e74c3c; word-break:break-all;">${donation.bloodGroup}</div></div>
                <div><div class="field-label">Hospital</div><div style="font-size:14px; font-weight:500; font-family:inherit; color:#f0e0e4; word-break:break-all;">${donation.hospital || "SevaSethu Hospital"}</div></div>
                <div><div class="field-label">City</div><div style="font-size:14px; font-weight:500; font-family:inherit; color:#f0e0e4; word-break:break-all;">${donation.user.city || "Unknown"}</div></div>
                <div><div class="field-label">Verified By</div><div style="font-size:14px; font-weight:500; font-family:inherit; color:#f0e0e4; word-break:break-all;">${donation.requesterName || "Verified Doctor"}</div></div>
                <div><div class="field-label">Donation Date</div><div style="font-size:14px; font-weight:500; font-family:inherit; color:#f0e0e4; word-break:break-all;">${fmt(donation.confirmedAt || Date.now())}</div></div>
                <div><div class="field-label">Units</div><div style="font-size:14px; font-weight:500; font-family:inherit; color:#f0e0e4; word-break:break-all;">1 bag · ${donation.units * 450 || 450} ml</div></div>
                <div><div class="field-label">Wallet</div><div style="font-size:11px; font-weight:500; font-family:'Share Tech Mono',monospace; color:#d4af37; word-break:break-all;">${shortWal}</div></div>
              </div>
              <div class="chain-box">
                <div class="chain-row"><span class="chain-label">TX HASH</span><span class="chain-val">${shortTx}</span></div>
                <div class="chain-row"><span class="chain-label">NETWORK</span><span class="chain-val">Hardhat Localhost</span></div>
                <div class="chain-row"><span class="chain-label">CONTRACT</span><span class="chain-val">0x5FbDB2315678afecb367f032d93F642f64180aa3</span></div>
                <div class="chain-row"><span class="chain-label">STANDARD</span><span class="chain-val">ERC-721 · IPFS Metadata</span></div>
              </div>
              <div class="footer">
                <div style="flex:1"></div>
                <div class="footer-text">LIFELINE·NFT<br/>v1.0.0</div>
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
