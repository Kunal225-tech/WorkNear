import { NextRequest, NextResponse } from "next/server";

export function asyncHandler(
    handler: (req: NextRequest) => Promise<NextResponse>
) {
    return async (req: NextRequest) => {
        try {
            return await handler(req);
        } catch (error) {
            console.error(error);

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error",
                },
                {
                    status: 500,
                }
            );
        }
    };
}