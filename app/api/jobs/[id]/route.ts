import { getJobById } from "@/actions/jobs/getJobById";
import { errorResponse, successResponse } from "@/lib/api-response";
import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { updateJob } from "@/actions/jobs/updateJob";
import { deleteJob } from "@/actions/jobs/deleteJob";
import { updateJobSchema } from "@/validators/job.schema";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid Job ID", 400);
        }
        const job = await getJobById(id);
        if (!job) {
            return errorResponse("Job not found", 404);
        }
        return successResponse("Job fetched successfully", job);
    } catch (error) {
        console.error("Error fetching job by ID API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}

export async function PATCH(
    request: Request,
    { params }: RouteParams
) {
    try {
        const authUser = await getApiAuthUser(request);

        if (!authUser || !authUser.id) {
            return errorResponse("Unauthorized", 401);
        }

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid Job ID", 400);
        }
        const body = await request.json();
        const validatedData = updateJobSchema.safeParse(body);
        if (!validatedData.success) {
            return errorResponse(
                validatedData.error.issues[0].message,
                400
            );
        }

        const existingJob = await getJobById(id);

        if (!existingJob) {
            return errorResponse("Job not found", 404);
        }

        const postedById = typeof existingJob.postedBy === "object" && existingJob.postedBy !== null && "_id" in existingJob.postedBy
            ? String(existingJob.postedBy._id)
            : String(existingJob.postedBy);

        if (postedById !== authUser.id) {
            return errorResponse(
                "You are not authorized to update this job",
                403
            );
        }

        if (validatedData.data.status) {
            if (validatedData.data.status === "completed" && existingJob.status !== "assigned") {
                return errorResponse("Only assigned jobs can be marked as completed", 400);
            }
            if (validatedData.data.status === "assigned" && existingJob.status !== "open") {
                return errorResponse("Invalid status transition", 400);
            }
            if (existingJob.status === "completed" || existingJob.status === "cancelled") {
                return errorResponse("Cannot change status of a completed or cancelled job", 400);
            }
        }

        const updatedJob = await updateJob({
            jobId: id,
            ...validatedData.data,
        });

        if (!updatedJob) {
            return errorResponse("Failed to update job", 500);
        }

        return successResponse(
            "Job updated successfully",
            updatedJob
        );
    } catch (error) {
        console.error("Error updating job API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteParams
) {
    try {
        const authUser = await getApiAuthUser(request);

        if (!authUser || !authUser.id) {
            return errorResponse("Unauthorized", 401);
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid Job ID", 400);
        }

        const existingJob = await getJobById(id);

        if (!existingJob) {
            return errorResponse("Job not found", 404);
        }

        const postedById = typeof existingJob.postedBy === "object" && existingJob.postedBy !== null && "_id" in existingJob.postedBy
            ? String(existingJob.postedBy._id)
            : String(existingJob.postedBy);

        if (postedById !== authUser.id) {
            return errorResponse(
                "You are not authorized to delete this job",
                403
            );
        }

        const deletedJob = await deleteJob(id);

        if (!deletedJob) {
            return errorResponse("Failed to delete job", 500);
        }

        return successResponse(
            "Job deleted successfully",
            null
        );
    } catch (error) {
        console.error("Error deleting job API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}