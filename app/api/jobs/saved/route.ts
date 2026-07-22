import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { getSavedJobs } from "@/actions/jobs/getSavedJobs";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getApiAuthUser(req);
        if (!authUser?.id) {
            return errorResponse("Unauthorized", 401);
        }

        const jobs = await getSavedJobs(authUser.id);
        return successResponse("Saved jobs fetched successfully", jobs);
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
