import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { getUserProfile } from "@/actions/profile/getUserProfile";
import { updateUserProfile } from "@/actions/profile/updateUserProfile";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
    skills: z.array(z.string()).optional(),
    profileImage: z.string().optional(),
});

export const GET = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized access", 401);
    }

    const userProfile = await getUserProfile(authUser.id);
    return successResponse(userProfile, "Profile fetched successfully");
});

export const PATCH = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized access", 401);
    }

    const body = await req.json();
    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
        return errorResponse(parseResult.error.issues[0].message, 400);
    }

    const updated = await updateUserProfile({
        userId: authUser.id,
        ...parseResult.data,
    });

    return successResponse(updated, "Profile updated successfully");
});
