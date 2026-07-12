import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { CreateJobInput } from "@/validators/job.schema";

interface CreateJobParams extends CreateJobInput {
    postedBy: string;
}

export async function createJob(data: CreateJobParams) {
    try {
        await connectDB();

        const job = await Job.create(data);

        return {
            success: true,
            message: "Job created successfully",
            data: job,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to create job",
        };
    }
}