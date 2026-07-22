import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { toggleSaveJob } from "@/actions/jobs/toggleSaveJob";
import { errorResponse, successResponse } from "@/lib/api-response";
import mongoose from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const authUser = await getApiAuthUser(request);
        if (!authUser?.id) {
            return errorResponse("Unauthorized", 401);
        }

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid Job ID", 400);
        }

        const result = await toggleSaveJob(authUser.id, id);
        const message = result.saved
            ? "Job saved to bookmarks"
            : "Job removed from bookmarks";

        return successResponse(message, result);
    } catch (error) {
        console.error("Error toggling save job:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
