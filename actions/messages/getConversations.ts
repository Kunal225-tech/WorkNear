import { connectDB } from "@/db/connect";
import { Message } from "@/models/Message";

import mongoose from "mongoose";

export async function getConversations(userId: string) {
    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate to find the latest message for each job where the user is either sender or receiver
    const conversations = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: userObjectId }, { receiver: userObjectId }],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $group: {
                _id: "$job",
                latestMessage: { $first: "$$ROOT" },
                unreadCount: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$receiver", userObjectId] }, { $eq: ["$read", false] }] },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        {
            $lookup: {
                from: "jobs",
                localField: "_id",
                foreignField: "_id",
                as: "jobDetails",
            },
        },
        {
            $unwind: "$jobDetails",
        },
        // We only care about jobs that are still assigned or completed
        {
            $match: {
                "jobDetails.status": { $in: ["assigned", "completed"] }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "latestMessage.sender",
                foreignField: "_id",
                as: "senderDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "latestMessage.receiver",
                foreignField: "_id",
                as: "receiverDetails",
            },
        },
        {
            $unwind: "$senderDetails",
        },
        {
            $unwind: "$receiverDetails",
        },
        {
            $sort: { "latestMessage.createdAt": -1 },
        },
    ]);

    // Format the output
    const formatted = conversations.map((conv) => {
        // Find the other participant's details
        const otherParticipant =
            String(conv.senderDetails._id) === userId
                ? conv.receiverDetails
                : conv.senderDetails;

        return {
            jobId: conv._id,
            jobTitle: conv.jobDetails.title,
            jobStatus: conv.jobDetails.status,
            otherParticipant: {
                id: otherParticipant._id,
                name: otherParticipant.name,
                profileImage: otherParticipant.profileImage,
            },
            latestMessage: {
                content: conv.latestMessage.content,
                createdAt: conv.latestMessage.createdAt,
                read: conv.latestMessage.read,
                isMine: String(conv.latestMessage.sender) === userId,
            },
            unreadCount: conv.unreadCount,
        };
    });

    return JSON.parse(JSON.stringify(formatted));
}
