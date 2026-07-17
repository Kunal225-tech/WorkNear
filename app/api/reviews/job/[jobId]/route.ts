import { NextRequest } from "next/server";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { getReviewsByJob } from "@/actions/reviews/getReviewsByJob";
import { isValidObjectId } from "mongoose";

export const GET = asyncHandler(async (req: NextRequest, ...args: any[]) => {
    const context = args[0];
    const params = await context?.params;
    const jobId = params?.jobId;

    if (!jobId || !isValidObjectId(jobId)) {
        return errorResponse("Invalid Job ID format", 400);
    }

    const reviews = await getReviewsByJob(jobId);
    return successResponse(reviews, "Job reviews fetched successfully");
});
