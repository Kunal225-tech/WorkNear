"use server";

import { connectDB } from "@/db/connect";
import { Review } from "@/models/Review";

export async function getReviewsByJob(jobId: string) {
    await connectDB();

    const reviews = await Review.find({ job: jobId })
        .populate("reviewer", "name profileImage")
        .populate("reviewee", "name profileImage")
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(reviews));
}
