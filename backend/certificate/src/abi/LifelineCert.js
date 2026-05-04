// src/abi/LifelineCert.json
// This is generated automatically after:  npx hardhat compile
// It lives in artifacts/contracts/LifelineCert.sol/LifelineCert.json
// We copy just the "abi" array here for the frontend to use

const ABI = [
    // ── MINT (self — donor mints their own) ──────────────────────
    {
        inputs: [
            { internalType: "string", name: "_donorName", type: "string" },
            { internalType: "string", name: "_bloodType", type: "string" },
            { internalType: "string", name: "_hospital", type: "string" },
            { internalType: "string", name: "_city", type: "string" },
            { internalType: "string", name: "_doctorName", type: "string" },
            { internalType: "uint256", name: "_donationDate", type: "uint256" },
            { internalType: "uint256", name: "_units", type: "uint256" },
            { internalType: "string", name: "_tokenURI", type: "string" },
        ],
        name: "selfMintCertificate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },

    // ── READ: get all token IDs owned by a wallet ────────────────
    {
        inputs: [{ internalType: "address", name: "_donor", type: "address" }],
        name: "getDonorTokens",
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
    },

    // ── READ: get one donation record by tokenId ─────────────────
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "getDonationRecord",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "donorName",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "bloodType",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "hospital",
                        type: "string",
                    },
                    { internalType: "string", name: "city", type: "string" },
                    {
                        internalType: "string",
                        name: "doctorName",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "donationDate",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "units", type: "uint256" },
                    { internalType: "bool", name: "verified", type: "bool" },
                ],
                internalType: "struct LifelineCert.DonationRecord",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },

    // ── READ: total NFTs minted ───────────────────────────────────
    {
        inputs: [],
        name: "totalMinted",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },

    // ── EVENT: fired on every mint ────────────────────────────────
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "donor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "bloodType",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "hospital",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "donationDate",
                type: "uint256",
            },
        ],
        name: "CertificateMinted",
        type: "event",
    },
];

export default ABI;
