import { Schema, model } from "mongoose";

const donationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["donated", "received", "accepted", "rejected", "missed", "reward"],
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        units: {
            type: Number,
            default: 0,
        },
        hospital: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["completed", "pending", "cancelled", "missed"],
            default: "pending",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        tokensEarned: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: "",
        },
        // Linked entities
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        request: {
            type: Schema.Types.ObjectId,
            ref: "BloodRequest",
            default: null,
        },
        requestType: {
            type: String,
            enum: ["urgent", "scheduled", ""],
            default: "",
        },
        donorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        donorName: {
            type: String,
            default: "",
        },
        requesterName: {
            type: String,
            default: "",
        },
        requesterPhone: {
            type: String,
            default: "",
        },
        acceptedAt: {
            type: Date,
            default: null,
        },
        confirmedAt: {
            type: Date,
            default: null,
        },
        rejectedAt: {
            type: Date,
            default: null,
        },
        certificateAvailable: {
            type: Boolean,
            default: false,
        },
        approvalNote: {
            type: String,
            default: "",
        },
        certificateMinted: {
            type: Boolean,
            default: false,
        },
        certificateTokenId: {
            type: String,
            default: "",
        },
        certificateTxHash: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

donationSchema.index({ user: 1, type: 1 });
donationSchema.index({ request: 1 });

const Donation = model("Donation", donationSchema);

export default Donation;
