import { Schema, model } from "mongoose";

const bloodRequestSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["urgent", "scheduled"],
            required: true,
        },
        patientName: {
            type: String,
            default: "",
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        units: {
            type: Number,
            required: true,
            min: 1,
        },
        hospital: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        urgency: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium",
        },
        contact: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            default: "",
        },
        time: {
            type: String,
            default: "",
        },
        requester: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requesterName: {
            type: String,
            required: true,
        },
        // Donors who accepted this request
        acceptedDonors: [
            {
                donor: { type: Schema.Types.ObjectId, ref: "User" },
                name: String,
                bloodGroup: String,
                distance: { type: String, default: "N/A" },
                rating: { type: Number, default: 0 },
                phone: String,
                lastDonation: String,
                totalDonations: { type: Number, default: 0 },
                acceptedAt: { type: Date, default: Date.now },
                confirmed: { type: Boolean, default: false },
            },
        ],
        status: {
            type: String,
            enum: ["open", "fulfilled", "cancelled"],
            default: "open",
        },
    },
    { timestamps: true },
);

bloodRequestSchema.index({ bloodGroup: 1, type: 1 });
bloodRequestSchema.index({ requester: 1 });
bloodRequestSchema.index({ status: 1 });

const BloodRequest = model("BloodRequest", bloodRequestSchema);

export default BloodRequest;
