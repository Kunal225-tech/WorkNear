

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
import { Review } from "@/models/Review";
import { auth } from "@/auth";

export async function getUserProfile(userId: string) {
    await connectDB();

    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        throw new Error("User not found");
    }

    const session = await auth();
    const isAuthenticated = !!session?.user;

    const reviews = await Review.find({ reviewee: userId })
        .populate("reviewer", "name profileImage")
        .sort({ createdAt: -1 })
        .lean();

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    // Privacy protection: mask sensitive contact info for unauthenticated visitors
    const sanitizedUser = { ...user };
    if (!isAuthenticated) {
        if (sanitizedUser.phone) {
            // Mask phone: e.g., "+91 98••••••34"
            const p = sanitizedUser.phone.trim();
            sanitizedUser.phone = p.length > 4
                ? p.slice(0, 3) + "••••••" + p.slice(-2)
                : "••••••••";
        }
        delete sanitizedUser.email;
    }

    return JSON.parse(
        JSON.stringify({
            ...sanitizedUser,
            isPhoneMasked: !isAuthenticated && !!user.phone,
            reviewCount,
            averageRating,
            reviews,
        })
    );
}
