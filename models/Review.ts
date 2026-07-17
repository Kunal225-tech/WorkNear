import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple reviews by the same person for the exact same job and reviewee
ReviewSchema.index({ job: 1, reviewer: 1, reviewee: 1 }, { unique: true });

if (process.env.NODE_ENV !== "production" && models.Review) {
    delete models.Review;
}

export const Review = models.Review || model("Review", ReviewSchema);
