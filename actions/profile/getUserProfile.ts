

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
import { Review } from "@/models/Review";

export async function getUserProfile(userId: string) {
    await connectDB();

    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        throw new Error("User not found");
    }

    const reviews = await Review.find({ reviewee: userId })
        .populate("reviewer", "name profileImage")
        .sort({ createdAt: -1 })
        .lean();

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    return JSON.parse(
        JSON.stringify({
            ...user,
            reviewCount,
            averageRating,
            reviews,
        })
    );
}
