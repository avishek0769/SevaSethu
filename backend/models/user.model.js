import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            default: "O+",
        },
        age: {
            type: Number,
            default: 0,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Male",
        },
        role: {
            type: String,
            enum: ["donor", "requester"],
            default: "donor",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        state: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        totalDonations: {
            type: Number,
            default: 0,
        },
        tokensEarned: {
            type: Number,
            default: 0,
        },
        rank: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        healthIssues: {
            type: [String],
            default: [],
        },
        lastDonation: {
            type: Date,
            default: null,
        },
        level: {
            type: String,
            enum: ["Bronze", "Silver", "Gold", "Platinum"],
            default: "Bronze",
        },
        refreshToken: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};

/**
 * Recalculates user level based on totalDonations.
 */
userSchema.methods.recalculateLevel = function () {
    if (this.totalDonations >= 25) this.level = "Platinum";
    else if (this.totalDonations >= 10) this.level = "Gold";
    else if (this.totalDonations >= 5) this.level = "Silver";
    else this.level = "Bronze";
};

const User = model("User", userSchema);

export default User;