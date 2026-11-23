import { NextRequest } from "next/server";
import { getApiAuthUser } from "@/lib/api-auth";
import { asyncHandler, successResponse, errorResponse } from "@/lib/async-handler";
import { getMessages } from "@/actions/messages/getMessages";
import { sendMessage } from "@/actions/messages/sendMessage";
import { getConversations } from "@/actions/messages/getConversations";
import { markAsRead } from "@/actions/messages/markAsRead";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

const sendMessageSchema = z.object({
    jobId: z.string().refine((val) => isValidObjectId(val), { message: "Invalid Job ID" }),
    content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
});

const markReadSchema = z.object({
    jobId: z.string().refine((val) => isValidObjectId(val), { message: "Invalid Job ID" }),
});

export const GET = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized", 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const jobId = searchParams.get("jobId");

    try {
        if (jobId) {
            if (!isValidObjectId(jobId)) {
                return errorResponse("Invalid Job ID", 400);
            }
            const messages = await getMessages(jobId, authUser.id);
            return successResponse(messages, "Messages fetched successfully");
        } else {
            // Fetch inbox summary
            const conversations = await getConversations(authUser.id);
            return successResponse(conversations, "Conversations fetched successfully");
        }
    } catch (err: any) {
        // Return 403 or 400 based on error message, defaulting to 400
        const status = err.message.includes("authorized") ? 403 : 400;
        return errorResponse(err.message, status);
    }
});

export const POST = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const parseResult = sendMessageSchema.safeParse(body);
    
    if (!parseResult.success) {
        return errorResponse(parseResult.error.issues[0].message, 400);
    }

    try {
        const message = await sendMessage(
            parseResult.data.jobId,
            authUser.id,
            parseResult.data.content
        );
        return successResponse(message, "Message sent successfully", 201);
    } catch (err: any) {
        const status = err.message.includes("authorized") ? 403 : 400;
        return errorResponse(err.message, status);
    }
});

export const PATCH = asyncHandler(async (req: NextRequest) => {
    const authUser = await getApiAuthUser(req);
    if (!authUser) {
        return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const parseResult = markReadSchema.safeParse(body);
    
    if (!parseResult.success) {
        return errorResponse(parseResult.error.issues[0].message, 400);
    }

    try {
        await markAsRead(parseResult.data.jobId, authUser.id);
        return successResponse(null, "Messages marked as read");
    } catch (err: any) {
        const status = err.message.includes("authorized") ? 403 : 400;
        return errorResponse(err.message, status);
    }
});
