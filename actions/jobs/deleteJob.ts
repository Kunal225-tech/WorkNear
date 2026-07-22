

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";

export async function deleteJob(jobId: string) {
    await connectDB();

    const deletedJob = await Job.findByIdAndDelete(jobId).lean();

    return deletedJob ? JSON.parse(JSON.stringify(deletedJob)) : null;
}
