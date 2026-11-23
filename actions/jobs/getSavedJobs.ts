import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
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
