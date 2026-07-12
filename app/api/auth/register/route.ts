import { NextRequest, NextResponse } from "next/server";

import { registerUser } from "@/actions/auth/registerUser";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await registerUser(body);

        return NextResponse.json(result, { status: result.success ? 201 : 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}