"use server";

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";

export async function getJobs() {
  await connectDB();

  const jobs = await Job.find()
    .populate("postedBy", "name profileImage")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(jobs));
}