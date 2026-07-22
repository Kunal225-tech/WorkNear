import { Schema, model, models } from "mongoose";

import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { JOB_STATUS } from "@/constants/jobStatus";

const JobSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },

        category: {
            type: String,
            enum: JOB_CATEGORIES,
            required: true,
        },

        payment: {
            type: Number,
            required: true,
            min: 1,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        locationCoordinates: {
            type: {
                type: String,
                enum: ['Point'],
                required: false,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: false,
            }
        },

        requiredDate: {
            type: Date,
            required: true,
        },

        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: JOB_STATUS,
            default: "open",
        },

        images: [{
            type: String,
        }],
    },
    {
        timestamps: true,
    }
);

JobSchema.index({ locationCoordinates: "2dsphere" });

if (process.env.NODE_ENV !== "production" && models.Job) {
    delete models.Job;
}

export const Job = models.Job || model("Job", JobSchema);