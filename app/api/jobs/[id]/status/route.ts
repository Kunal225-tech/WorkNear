import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(["open", "assigned", "completed", "cancelled"]),
});

export const POST = asyncHandler(async (req: NextRequest, ...args: any[]) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized: Please log in", 401);
    }

    const context = args[0];
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
        return errorResponse("Invalid Job ID format", 400);
    }

    const body = await req.json();
    const parseResult = statusSchema.safeParse(body);
    if (!parseResult.success) {
        return errorResponse(parseResult.error.issues[0].message, 400);
    }

    await connectDB();
    const job = await Job.findById(id);
    if (!job) {
        return errorResponse("Job not found", 404);
    }

    // Verify ownership
    const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
        ? String(job.postedBy._id)
        : String(job.postedBy);

    if (postedById !== authUser.id) {
        return errorResponse("Forbidden: Only the task poster can change task status", 403);
    }

    // Validate state transitions
    const currentStatus = job.status;
    const newStatus = parseResult.data.status;

    if (currentStatus === "completed" || currentStatus === "cancelled") {
        return errorResponse("Cannot change status of a completed or cancelled job", 400);
    }
    if (newStatus === "completed" && currentStatus !== "assigned") {
        return errorResponse("Only assigned jobs can be marked as completed", 400);
    }
    if (newStatus === "assigned") {
        if (currentStatus !== "open") {
            return errorResponse("Invalid status transition: job must be open to be assigned", 400);
        }
        // Require a legitimately accepted application before setting to "assigned"
        const acceptedApp = await Application.findOne({ job: id, status: "accepted" });
        if (!acceptedApp) {
            return errorResponse("Cannot assign job: no accepted applicant found. Accept an application first.", 400);
        }
    }

    job.status = newStatus;
    await job.save();

    return successResponse(JSON.parse(JSON.stringify(job)), `Task marked as ${job.status}`);
});

