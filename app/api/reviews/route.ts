import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { createReview } from "@/actions/reviews/createReview";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

const createReviewSchema = z.object({
    jobId: z.string().refine((val) => isValidObjectId(val), {
        message: "Invalid Job ID format",
    }),
    revieweeId: z.string().refine((val) => isValidObjectId(val), {
        message: "Invalid Reviewee User ID format",
    }),
    rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
    comment: z.string().min(5, "Comment must be at least 5 characters").max(500, "Comment cannot exceed 500 characters"),
});

export const POST = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized: You must be logged in to submit a review", 401);
    }

    const body = await req.json();
    const parseResult = createReviewSchema.safeParse(body);
    if (!parseResult.success) {
        return errorResponse(parseResult.error.issues[0].message, 400);
    }

    const { jobId, revieweeId, rating, comment } = parseResult.data;

    if (revieweeId === authUser.id) {
        return errorResponse("You cannot leave a review for yourself", 403);
    }

    try {
        const review = await createReview({
            jobId,
            reviewerId: authUser.id,
            revieweeId,
            rating,
            comment,
        });

        return successResponse(review, "Review submitted successfully", 201);
    } catch (err: any) {
        return errorResponse(err.message || "Failed to submit review", 400);
    }
});
