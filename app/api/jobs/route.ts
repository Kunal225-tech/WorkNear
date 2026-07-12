import { NextRequest } from "next/server";

import { createJob } from "@/actions/jobs/createJob";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createJobSchema } from "@/validators/job.schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = createJobSchema.safeParse(body);

        if (!validatedData.success) {
            return errorResponse(validatedData.error.issues[0].message);
        }

        /*
          TODO:
          Replace this with Auth.js session later.
        */
        const userId = "686e88e2fdfe6b7b67af807f";

        const result = await createJob({
            ...validatedData.data,
            postedBy: userId,
        });

        if (!result.success) {
            return errorResponse(result.message);
        }

        return successResponse(result.message, result.data, 201);
    } catch (error) {
        console.error(error);

        return errorResponse("Internal Server Error", 500);
    }
}