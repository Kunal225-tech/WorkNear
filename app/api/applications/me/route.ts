import { getApiAuthUser } from "@/lib/api-auth";
import { getMyApplications } from "@/actions/applications/getMyApplications";
import { errorResponse, successResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getApiAuthUser(req);

    if (!authUser || !authUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const applications = await getMyApplications(authUser.id);

    return successResponse(
      "Applications fetched successfully",
      applications
    );
  } catch (error) {
    console.error("Error fetching my applications API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}