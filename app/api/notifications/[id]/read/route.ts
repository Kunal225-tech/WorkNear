import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { markNotificationAsRead } from "@/actions/notifications/markNotificationsRead";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getApiAuthUser(req);

    if (!authUser || !authUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;

    const result = await markNotificationAsRead(id, authUser.id);

    if (!result.success) {
      return errorResponse(result.message, result.code || 400);
    }

    return successResponse(result.message, result.notification, 200);
  } catch (error) {
    console.error("Error in PATCH /api/notifications/[id]/read:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
