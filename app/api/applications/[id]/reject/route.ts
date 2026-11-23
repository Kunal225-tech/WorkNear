import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { getApplicationById } from "@/actions/applications/getApplicationById";
import { rejectApplication } from "@/actions/applications/rejectApplication";
import { errorResponse, successResponse } from "@/lib/api-response";
import { sendMail } from "@/lib/mailer";
import { applicationRejectedEmail } from "@/lib/email-templates";
import { createNotification } from "@/actions/notifications/createNotification";
import { connectDB } from "@/db/connect";
import { User } from "@/models/User";

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
      title?: string;
      _id?: string;
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

    // ── Create In-App Notification & Email for rejected applicant ──
    try {
      await connectDB();
      const applicant = application.applicant as any;
      const applicantId = typeof applicant === "object" && "_id" in applicant
        ? String(applicant._id)
        : String(applicant);

      const applicantUser = await User.findById(applicantId).select("email name").lean() as any;

      if (job.title) {
        // Create in-app notification
        await createNotification({
          recipientId: applicantId,
          senderId: authUser.id,
          type: "application_rejected",
          title: "Application Update",
          message: `Your application for "${job.title}" was not selected.`,
          link: `/dashboard/my-applications`,
        });
      }

      if (applicantUser?.email && job.title) {
        const { subject, html } = applicationRejectedEmail(
          applicantUser.name || "there",
          job.title,
          String(job._id || "")
        );
        await sendMail({ to: applicantUser.email, subject, html });
      }
    } catch (emailErr) {
      console.error("[Notification/Email] Failed to send rejection notification:", emailErr);
    }

    return successResponse(
      "Application rejected successfully",
      updatedApplication
    );
  } catch (error) {
    console.error("Error rejecting application API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}