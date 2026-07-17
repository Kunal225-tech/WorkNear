import mongoose, { Document, Model, Schema } from "mongoose";

export interface IApplication extends Document {
    job: mongoose.Types.ObjectId;
    applicant: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "withdrawn"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application: Model<IApplication> =
    mongoose.models.Application ||
    mongoose.model<IApplication>(
        "Application",
        applicationSchema
    );