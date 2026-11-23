import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getNotifications } from "@/actions/notifications/getNotifications";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getApiAuthUser(req);

    if (!authUser || !authUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = req.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await getNotifications({
      userId: authUser.id,
      limit,
      page,
      unreadOnly,
    });

    if (!result.success) {
      return errorResponse(result.message || "Failed to fetch notifications", 500);
    }

    return successResponse("Notifications fetched successfully", result.data, 200);
  } catch (error) {
    console.error("Error in GET /api/notifications:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
