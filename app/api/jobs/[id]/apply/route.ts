import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { createApplication } from "@/actions/applications/createApplication";
import { getApplication } from "@/actions/applications/getApplication";
import { getJobById } from "@/actions/jobs/getJobById";
import { errorResponse, successResponse } from "@/lib/api-response";
import { sendMail } from "@/lib/mailer";
import { newApplicationEmail } from "@/lib/email-templates";
import { User } from "@/models/User";
import { connectDB } from "@/db/connect";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
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
      return errorResponse("Invalid Job ID", 400);
    }

    const job = await getJobById(id);

    if (!job) {
      return errorResponse("Job not found", 404);
    }
    if (job.status !== "open") {
      return errorResponse(
        "This job is no longer accepting applications",
        403
      );
    }

    const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
      ? String(job.postedBy._id)
      : String(job.postedBy);

    if (postedById === authUser.id) {
      return errorResponse(
        "You cannot apply to your own job",
        403
      );
    }

    const existingApplication = await getApplication({
      job: id,
      applicant: authUser.id,
    });

    if (existingApplication) {
      return errorResponse(
        "You have already applied for this job",
        409
      );
    }

    const application = await createApplication({
      job: id,
      applicant: authUser.id,
    });

    // ── Send email notification to job poster ──
    try {
      await connectDB();
      const poster = typeof job.postedBy === "object" && "email" in job.postedBy
        ? job.postedBy as any
        : await User.findById(postedById).select("email name").lean() as any;

      const applicantUser = await User.findById(authUser.id).select("name").lean() as any;

      if (poster?.email) {
        const { subject, html } = newApplicationEmail(
          poster.name || "there",
          job.title,
          applicantUser?.name || "A worker",
          id
        );
        await sendMail({ to: poster.email, subject, html });
      }
    } catch (emailErr) {
      console.error("[Email] Failed to send new application notification:", emailErr);
    }

    return successResponse(
      "Application submitted successfully",
      application,
      201
    );
  } catch (error) {
    console.error("Error applying to job API:", error);
    return errorResponse("Internal Server Error", 500);
  }
}