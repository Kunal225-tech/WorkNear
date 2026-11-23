import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { markAllNotificationsAsRead } from "@/actions/notifications/markNotificationsRead";

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getApiAuthUser(req);

    if (!authUser || !authUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const result = await markAllNotificationsAsRead(authUser.id);

    if (!result.success) {
      return errorResponse(result.message, 500);
    }

    return successResponse(result.message, null, 200);
  } catch (error) {
    console.error("Error in PATCH /api/notifications/read-all:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
