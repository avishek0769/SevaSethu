import { Schema, model } from "mongoose";

const bloodBankSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        availableGroups: {
            type: [String],
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            default: [],
        },
        isOpen: {
            type: Boolean,
            default: true,
        },
        openHours: {
            type: String,
            default: "9:00 AM - 5:00 PM",
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        latitude: {
            type: Number,
            default: 0,
        },
        longitude: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const BloodBank = model("BloodBank", bloodBankSchema);

export default BloodBank;
