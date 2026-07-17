"use server";

import { connectDB } from "@/db/connect";
import { Review } from "@/models/Review";
import { Job } from "@/models/Job";

interface CreateReviewInput {
    jobId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment: string;
}

export async function createReview({
    jobId,
    reviewerId,
    revieweeId,
    rating,
    comment,
}: CreateReviewInput) {
    await connectDB();

    // Verify job is completed or assigned
    const job = await Job.findById(jobId).lean();
    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "completed" && job.status !== "assigned") {
        throw new Error("Reviews can only be submitted for completed or assigned tasks");
    }

    // Check if a review already exists
    const existing = await Review.findOne({
        job: jobId,
        reviewer: reviewerId,
        reviewee: revieweeId,
    }).lean();

    if (existing) {
        throw new Error("You have already submitted a review for this task and person");
    }

    const review = await Review.create({
        job: jobId,
        reviewer: reviewerId,
        reviewee: revieweeId,
        rating,
        comment,
    });

    const populatedReview = await Review.findById(review._id)
        .populate("reviewer", "name profileImage")
        .lean();

    return JSON.parse(JSON.stringify(populatedReview));
}
