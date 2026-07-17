import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
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

    // Verify ownership or assignment
    const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
        ? String(job.postedBy._id)
        : String(job.postedBy);

    if (postedById !== authUser.id) {
        return errorResponse("Forbidden: Only the task poster can change task status", 403);
    }

    job.status = parseResult.data.status;
    await job.save();

    return successResponse(JSON.parse(JSON.stringify(job)), `Task marked as ${job.status}`);
});
