import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { getApplicationById } from "@/actions/applications/getApplicationById";
import { rejectApplication } from "@/actions/applications/rejectApplication";
import { errorResponse, successResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const authUser = await getApiAuthUser(request);

    if (!authUser || !authUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid Application ID", 400);
    }

    const application = await getApplicationById(id);

    if (!application) {
      return errorResponse("Application not found", 404);
    }

    const job = application.job as {
      postedBy?: mongoose.Types.ObjectId | string;
      status?: string;
    };

    const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
      ? String(job.postedBy._id)
      : String(job.postedBy);

    if (postedById !== authUser.id) {
      return errorResponse(
        "You are not authorized to reject this application",
        403
      );
    }

    if (job.status !== "open") {
      return errorResponse(
        "This job has already been assigned",
        400
      );
    }

    if (application.status !== "pending") {
      return errorResponse(
        `Application has already been ${application.status}`,
        400
      );
    }

    const updatedApplication = await rejectApplication(id);

    return successResponse(
      "Application rejected successfully",
      updatedApplication
    );
  } catch (error) {
    console.error("Error rejecting application API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}