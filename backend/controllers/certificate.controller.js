import { ethers } from "ethers";
import PDFDocument from "pdfkit";
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

    // 3. Generate PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=SevaSethu_Certificate_${donationId}.pdf`);

    const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
    });

    doc.pipe(res);

    // PDF Styling
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fa");
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#e11d48");
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#be123c");

    // Header
    doc.fillColor("#be123c").fontSize(40).text("CERTIFICATE", 0, 90, { align: "center" });
    doc.fillColor("#000000").fontSize(20).text("OF APPRECIATION", 0, 135, { align: "center" });

    // Body
    doc.fontSize(14).text("THIS IS PROUDLY PRESENTED TO", 0, 200, { align: "center" });
    
    doc.fillColor("#e11d48").fontSize(32).text(donation.donorName || donation.user.name, 0, 230, { align: "center" });
    
    doc.fillColor("#4b5563").fontSize(14).text(
        `For their selfless and noble act of donating ${donation.units} unit(s) of ${donation.bloodGroup} blood at ${donation.hospital}. Your contribution is a lifeline to those in need.`, 
        100, 280, { align: "center", width: doc.page.width - 200 }
    );

    // Meta Data
    doc.fillColor("#000000").fontSize(12).text(`Date: ${new Date(donation.confirmedAt || Date.now()).toLocaleDateString()}`, 100, 360);
    doc.text(`Authorized by: ${donation.requesterName || "SevaSethu Network"}`, doc.page.width - 300, 360, { align: "right" });

    // Blockchain Info Footer
    doc.fontSize(10).fillColor("#6b7280").text(`Blockchain Verified (Polygon Amoy)`, 100, 450);
    doc.text(`Token ID: ${donation.certificateTokenId}`, 100, 465);
    doc.text(`Tx Hash: ${donation.certificateTxHash}`, 100, 480);

    doc.end();
});

export { downloadCertificate };
