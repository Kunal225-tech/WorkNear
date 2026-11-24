import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";

export async function getJobById(jobId: string) {
  await connectDB();

  const job = await Job.findById(jobId)
    .populate("postedBy", "name profileImage")
    .lean();

  return job ? JSON.parse(JSON.stringify(job)) : null;
}