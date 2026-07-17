"use server";

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

export async function getApplicationsByJob(jobId: string) {
    await connectDB();

    const apps = await Application.find({
        job: jobId,
    })
        .populate("applicant", "name profileImage email")
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(apps));
}