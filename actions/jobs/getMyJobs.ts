"use server";

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";

export async function getMyJobs(userId: string) {
  await connectDB();

  const jobs = await Job.find({ postedBy: userId })
    .populate("postedBy", "name profileImage")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(jobs));
}
