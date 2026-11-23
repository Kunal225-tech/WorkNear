import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: false,
        },

        authProvider: {
            type: String,
            enum: ["credentials", "google"],
            default: "credentials",
        },

        profileImage: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        savedJobs: {
            type: [{ type: Schema.Types.ObjectId, ref: "Job" }],
            default: [],
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

if (process.env.NODE_ENV !== "production" && models.User) {
    delete models.User;
}

export const User = models.User || model("User", UserSchema);