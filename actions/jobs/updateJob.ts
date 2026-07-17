"use server";

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";
import { UpdateJobInput } from "@/validators/job.schema";

interface UpdateJobParams extends UpdateJobInput {
    jobId: string;
}

export async function updateJob({
    jobId,
    ...jobData
}: UpdateJobParams) {
    await connectDB();

    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        jobData,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("postedBy", "name profileImage")
        .lean();

    return updatedJob ? JSON.parse(JSON.stringify(updatedJob)) : null;
}