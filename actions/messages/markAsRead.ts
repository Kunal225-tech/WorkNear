import { connectDB } from "@/db/connect";
import { Message } from "@/models/Message";
import { resolveMessagingParticipants } from "./participantResolver";

export async function markAsRead(jobId: string, currentUserId: string) {
    await connectDB();

    // Verify authorization and resolve participants
    const { receiverId } = await resolveMessagingParticipants(jobId, currentUserId);

    // Ensure the current user is marking THEIR RECEIVED messages as read.
    // They are the receiver in the context of unread messages sent by the other participant.
    // The participantResolver returns receiverId = the OTHER person, because it calculates the "receiver" of a new message.
    // So if currentUserId is A, resolver says receiver is B.
    // Unread messages for A are those where `receiver: A` and `sender: B`.

    await Message.updateMany(
        {
            job: jobId,
            receiver: currentUserId,
            read: false,
        },
        {
            $set: { read: true },
        }
    );

    return true;
}
