

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";

/**
 * Return all saved (bookmarked) jobs for a given user, fully populated.
 */
export async function getSavedJobs(userId: string) {
    await connectDB();

    const user = await User.findById(userId)
        .select("savedJobs")
        .populate({
            path: "savedJobs",
            populate: {
                path: "postedBy",
                select: "name profileImage location",
            },
        })
        .lean() as any;

    if (!user) return [];

    return JSON.parse(JSON.stringify(user.savedJobs || []));
}
