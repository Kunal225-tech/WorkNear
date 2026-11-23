import { connectDB } from "@/db/connect";
import { Message } from "@/models/Message";
import { resolveMessagingParticipants } from "./participantResolver";

export async function sendMessage(
    jobId: string,
    currentUserId: string,
    content: string
) {
    await connectDB();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Message content cannot be empty");
    }

    if (content.trim().length > 2000) {
        throw new Error("Message exceeds the 2000 character limit");
    }

    // Resolve participants and verify authorization
    const { senderId, receiverId } = await resolveMessagingParticipants(
        jobId,
        currentUserId
    );

    const message = await Message.create({
        job: jobId,
        sender: senderId,
        receiver: receiverId,
        content: content.trim(),
        read: false,
    });

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name profileImage")
        .populate("receiver", "name profileImage")
        .lean();

    return JSON.parse(JSON.stringify(populatedMessage));
}
