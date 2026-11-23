import { auth } from "@/auth";
import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { createJobSchema, CreateJobInput } from "@/validators/job.schema";
import { geocodeLocation } from "@/lib/geocode";

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

        let locationCoordinates = undefined;
        const coords = await geocodeLocation(validatedData.data.location);
        if (coords) {
            locationCoordinates = {
                type: 'Point',
                coordinates: coords,
            };
        }

        const job = await Job.create({
            ...validatedData.data,
            postedBy,
            ...(locationCoordinates ? { locationCoordinates } : {})
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