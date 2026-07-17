import { NextRequest } from "next/server";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { getUserProfile } from "@/actions/profile/getUserProfile";
import { isValidObjectId } from "mongoose";

export const GET = asyncHandler(async (req: NextRequest, ...args: any[]) => {
    const context = args[0];
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
        return errorResponse("Invalid User ID format", 400);
    }

    try {
        const userProfile = await getUserProfile(id);
        return successResponse(userProfile, "Public profile fetched successfully");
    } catch (err: any) {
        return errorResponse(err.message || "User profile not found", 404);
    }
});
