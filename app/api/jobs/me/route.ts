import { NextRequest } from "next/server";
import { getMyJobs } from "@/actions/jobs/getMyJobs";
import { getApiAuthUser } from "@/lib/api-auth";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getApiAuthUser(req);
        if (!authUser || !authUser.id) {
            return errorResponse("Unauthorized. Please log in or provide 'x-user-id' / 'Authorization: Bearer <userId>' header.", 401);
        }
        const jobs = await getMyJobs(authUser.id);

        return successResponse("User jobs fetched successfully", jobs, 200);
    } catch (error) {
        console.error("Error fetching my jobs API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
