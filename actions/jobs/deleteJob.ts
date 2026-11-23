import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { Review } from "@/models/Review";

export async function deleteJob(jobId: string) {
    await connectDB();

    const deletedJob = await Job.findByIdAndDelete(jobId).lean();

    if (deletedJob) {
        // Cleanup orphaned records
        await Application.deleteMany({ job: jobId });
        await Review.deleteMany({ job: jobId });
    }

    return deletedJob ? JSON.parse(JSON.stringify(deletedJob)) : null;
}
