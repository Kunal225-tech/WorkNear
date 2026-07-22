

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";

/**
 * Toggle a job in/out of the user's savedJobs array.
 * Returns { saved: true } if added, { saved: false } if removed.
 */
export async function toggleSaveJob(userId: string, jobId: string) {
    await connectDB();

    const user = await User.findById(userId).select("savedJobs").lean() as any;
    if (!user) throw new Error("User not found");

    const alreadySaved = user.savedJobs?.some(
        (id: any) => String(id) === String(jobId)
    );

    if (alreadySaved) {
        await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } });
        return { saved: false };
    } else {
        await User.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobId } });
        return { saved: true };
    }
}
