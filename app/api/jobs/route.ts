import { NextRequest } from "next/server";
import { createJob } from "@/actions/jobs/createJob";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createJobSchema } from "@/validators/job.schema";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await auth();

        let userId = session?.user?.id;
        if (!userId) {
            const authHeader = req.headers.get("authorization") || req.headers.get("x-user-id");
            if (authHeader) {
                userId = authHeader.replace("Bearer ", "");
            }
        }

        if (!userId) {
            return errorResponse("Unauthorized. Please log in or provide 'x-user-id' / 'Authorization: Bearer <userId>' header.", 401);
        }

        const validatedData = createJobSchema.safeParse(body);

        if (!validatedData.success) {
            return errorResponse(validatedData.error.issues[0].message);
        }

        const result = await createJob(validatedData.data, userId);
        if (!result.success) {
            return errorResponse(result.message);
        }

        return successResponse("Job created successfully", result.job, 201);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}