"use server";

import { auth } from "@/auth";
import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { createJobSchema, CreateJobInput } from "@/validators/job.schema";

export async function createJob(jobData: CreateJobInput, userId?: string) {
    try {
        let postedBy = userId;
        if (!postedBy) {
            const session = await auth();
            postedBy = session?.user?.id;
        }

        if (!postedBy) {
            return {
                success: false,
                message: "Unauthorized. Please log in to post a job.",
            };
        }

        const validatedData = createJobSchema.safeParse(jobData);
        if (!validatedData.success) {
            return {
                success: false,
                message: validatedData.error.issues[0].message,
            };
        }

        await connectDB();

        const job = await Job.create({
            ...validatedData.data,
            postedBy,
        });

        return {
            success: true,
            message: "Job created successfully",
            job: JSON.parse(JSON.stringify(job)),
        };
    } catch (error) {
        console.error("Error creating job:", error);
        return {
            success: false,
            message: "An unexpected error occurred while creating the job.",
        };
    }
}