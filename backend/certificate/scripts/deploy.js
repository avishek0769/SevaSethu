// scripts/deploy.js
// Run: npx hardhat run scripts/deploy.js --network amoy

const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying LifelineCert to Polygon...\n");

    // Get deployer wallet
    const [deployer] = await ethers.getSigners();
    console.log("📬 Deployer wallet:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "MATIC\n");

    if (balance === 0n) {
        console.error(
            "❌ No MATIC! Get free testnet MATIC from: https://faucet.polygon.technology/",
        );
        process.exit(1);
    }

    // Compile + deploy
    const LifelineCert = await ethers.getContractFactory("LifelineCert");
    console.log("⏳ Deploying contract...");

    const contract = await LifelineCert.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("\n✅ CONTRACT DEPLOYED SUCCESSFULLY!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📄 Contract Address:", address);
    console.log(
        "🔗 View on PolygonScan: https://amoy.polygonscan.com/address/" +
            address,
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("👉 NEXT STEPS:");
    console.log("  1. Copy this address into your .env file:");
    console.log(`     VITE_CONTRACT_ADDRESS=${address}`);
    console.log("  2. Run: npx hardhat verify --network amoy", address);
    console.log("  3. Run: npm run dev  →  your frontend is live!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
