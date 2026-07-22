import { NextRequest } from "next/server";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { getReviewsByUser } from "@/actions/reviews/getReviewsByUser";
import { isValidObjectId } from "mongoose";

export const GET = asyncHandler(async (req: NextRequest, ...args: any[]) => {
    const context = args[0];
    const params = await context?.params;
    const userId = params?.userId;

    if (!userId || !isValidObjectId(userId)) {
        return errorResponse("Invalid User ID format", 400);
    }

    const reviews = await getReviewsByUser(userId);
    return successResponse(reviews, "User reviews fetched successfully");
});
