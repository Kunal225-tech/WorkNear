import { NextRequest } from "next/server";
import { createJob } from "@/actions/jobs/createJob";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createJobSchema } from "@/validators/job.schema";
import { getApiAuthUser } from "@/lib/api-auth";
import { getJobs } from "@/actions/jobs/getJobs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const authUser = await getApiAuthUser(req);

        if (!authUser || !authUser.id) {
            return errorResponse("Unauthorized. Please log in or provide 'x-user-id' / 'Authorization: Bearer <userId>' header.", 401);
        }

        const validatedData = createJobSchema.safeParse(body);

        if (!validatedData.success) {
            return errorResponse(validatedData.error.issues[0].message, 400);
        }

        const result = await createJob(validatedData.data, authUser.id);
        if (!result.success) {
            return errorResponse(result.message, 400);
        }

        return successResponse("Job created successfully", result.job, 201);
    } catch (error) {
        console.error("Error creating job API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const radius = searchParams.get("radius");

        const jobs = await getJobs({ lat, lng, radius });
        return successResponse("Jobs fetched successfully", jobs, 200);
    }
    catch (error) {
        console.error("Error fetching jobs API:", error);
        return errorResponse("Internal Server Error", 500);
    }
}