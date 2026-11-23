import { auth } from "@/auth";
import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
import mongoose from "mongoose";

export interface ApiAuthUser {
    id: string;
    email?: string;
    name?: string;
}

/**
 * Helper to get authenticated user in API routes.
 * In production: only accepts a valid NextAuth JWT session.
 * In development: also accepts 'Authorization: Bearer <userId>' or 'x-user-id: <userId>' headers
 *   for easier API testing — these headers MUST NOT be enabled in production.
 */
export async function getApiAuthUser(req: Request): Promise<ApiAuthUser | null> {
    try {
        // 1. Try NextAuth session (always checked first in all environments)
        const session = await auth();
        if (session?.user?.id) {
            return {
                id: session.user.id,
                email: session.user.email || undefined,
                name: session.user.name || undefined,
            };
        }

        // 2. Development-only fallback: accept raw userId via header for programmatic testing.
        //    NEVER enabled in production — using a raw user ID as authentication is a
        //    complete authentication bypass (no password / session required).
        if (process.env.NODE_ENV !== "production") {
            const authHeader = req.headers.get("authorization") || req.headers.get("x-user-id");
            if (authHeader) {
                const userId = authHeader.replace("Bearer ", "").trim();
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    await connectDB();
                    const user = await User.findById(userId).select("_id email name").lean();
                    if (user) {
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    }
                }
            }
        }

        return null;
    } catch (error) {
        console.error("Error verifying API authentication:", error);
        return null;
    }
}
