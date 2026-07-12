import { NextRequest } from "next/server";

import { loginUser } from "@/actions/auth/loginUser";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await loginUser(body);

        if (!result.success) {
            return errorResponse(result.message);
        }

        return successResponse(result.message, result.data);
    } catch (error) {
        console.error(error);

        return errorResponse("Internal Server Error", 500);
    }
}