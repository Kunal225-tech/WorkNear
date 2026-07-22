

import { connectDB } from "@/db/connect";
import { Review } from "@/models/Review";

/**
 * Get all reviews where a user was the reviewee (reviews received).
 */
export async function getReviewsByUser(userId: string) {
    await connectDB();

    const reviews = await Review.find({ reviewee: userId })
        .populate("reviewer", "name profileImage location")
        .populate("job", "title category")
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(reviews));
}
