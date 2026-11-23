import { connectDB } from "@/db/connect";
import { Message } from "@/models/Message";
import { resolveMessagingParticipants } from "./participantResolver";

export async function getMessages(jobId: string, currentUserId: string) {
    await connectDB();

    // Verify authorization
    await resolveMessagingParticipants(jobId, currentUserId);

    // Fetch messages
    const messages = await Message.find({ job: jobId })
        .sort({ createdAt: 1 })
        .populate("sender", "name profileImage")
        .populate("receiver", "name profileImage")
        .lean();

    return JSON.parse(JSON.stringify(messages));
}
