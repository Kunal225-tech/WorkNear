import { NextRequest, NextResponse } from "next/server";
import { successResponse as origSuccess, errorResponse as origError } from "./api-response";

export function asyncHandler(
    handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse | Response>
) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (error: any) {
            console.error("AsyncHandler Error:", error);

            return NextResponse.json(
                {
                    success: false,
                    message: error?.message || "Internal Server Error",
                },
                {
                    status: error?.statusCode || 500,
                }
            );
        }
    };
}

export function successResponse(arg1: unknown, arg2: unknown = null, arg3: number = 200) {
    if (typeof arg1 === "string") {
        return origSuccess(arg1, arg2, typeof arg3 === "number" ? arg3 : 200);
    }
    const message = typeof arg2 === "string" ? arg2 : "Success";
    const status = typeof arg3 === "number" ? arg3 : 200;
    return origSuccess(message, arg1, status);
}

export function errorResponse(message: string, status: number = 400) {
    return origError(message, status);
}