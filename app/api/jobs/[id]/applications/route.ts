import mongoose from "mongoose";
import { getApiAuthUser } from "@/lib/api-auth";
import { getApplicationsByJob } from "@/actions/applications/getApplicationsByJob";
import { createApplication } from "@/actions/applications/createApplication";
import { getApplication } from "@/actions/applications/getApplication";
import { getJobById } from "@/actions/jobs/getJobById";
import { errorResponse, successResponse } from "@/lib/api-response";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
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

        const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
            ? String(job.postedBy._id)
            : String(job.postedBy);

        if (postedById !== authUser.id) {
            return errorResponse(
                "You are not authorized to view these applications",
                403
            );
        }

        const applications = await getApplicationsByJob(id);

        return successResponse(
            "Applications fetched successfully",
            applications
        );
    } catch (error) {
        console.error("Error fetching job applications API:", error);
        return errorResponse("Internal Server Error", 500);
    }
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

        const body = await request.json().catch(() => ({}));
        const coverLetter = typeof body?.coverLetter === "string" ? body.coverLetter.trim().slice(0, 500) : undefined;

        const application = await createApplication({
            job: id,
            applicant: authUser.id,
            coverLetter,
        });

        return successResponse(
            "Application submitted successfully",
            application,
            201
        );
    } catch (error) {
        console.error("Error creating application via job API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}