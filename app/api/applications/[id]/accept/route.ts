import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { getApplicationById } from "@/actions/applications/getApplicationById";
import { acceptApplication } from "@/actions/applications/acceptApplication";
import { errorResponse, successResponse } from "@/lib/api-response";
import { sendMail } from "@/lib/mailer";
import { applicationAcceptedEmail } from "@/lib/email-templates";
import { User } from "@/models/User";
import { connectDB } from "@/db/connect";

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

    // ── Send email notification to accepted applicant ──
    try {
      await connectDB();
      const applicant = application.applicant as any;
      const applicantId = typeof applicant === "object" && "_id" in applicant
        ? String(applicant._id)
        : String(applicant);

      const applicantUser = await User.findById(applicantId).select("email name").lean() as any;
      const posterUser = await User.findById(authUser.id).select("name").lean() as any;

      if (applicantUser?.email && job.title) {
        const { subject, html } = applicationAcceptedEmail(
          applicantUser.name || "there",
          job.title,
          posterUser?.name || "the employer",
          String(job._id || "")
        );
        await sendMail({ to: applicantUser.email, subject, html });
      }
    } catch (emailErr) {
      console.error("[Email] Failed to send accepted notification:", emailErr);
    }

    return successResponse(
      "Application accepted successfully",
      updatedApplication
    );
  } catch (error) {
    console.error("Error accepting application route API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
