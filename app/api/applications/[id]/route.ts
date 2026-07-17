import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { acceptApplication } from "@/actions/applications/acceptApplication";
import { getApplicationById } from "@/actions/applications/getApplicationById";
import { errorResponse, successResponse } from "@/lib/api-response";
import { deleteApplication } from "@/actions/applications/deleteApplication";

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
        "You are not authorized to accept this application",
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

    const updatedApplication = await acceptApplication(id);

    return successResponse(
      "Application accepted successfully",
      updatedApplication
    );
  } catch (error) {
    console.error("Error accepting application API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function DELETE(
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

    const applicant = application.applicant as {
      _id?: mongoose.Types.ObjectId | string;
    };

    const applicantId = typeof applicant === "object" && applicant !== null && "_id" in applicant
      ? String(applicant._id)
      : String(applicant);

    const job = application.job as {
      status?: string;
    };

    if (applicantId !== authUser.id) {
      return errorResponse(
        "You are not authorized to withdraw this application",
        403
      );
    }

    if (job.status !== "open") {
      return errorResponse(
        "Cannot withdraw application after job has been assigned",
        400
      );
    }

    if (application.status !== "pending") {
      return errorResponse(
        `Application has already been ${application.status}`,
        400
      );
    }

    await deleteApplication(id);

    return successResponse(
      "Application withdrawn successfully",
      null
    );
  } catch (error) {
    console.error("Error deleting/withdrawing application API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
