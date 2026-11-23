import mongoose, { Schema, model, models } from "mongoose";

export interface IMessage extends mongoose.Document {
    job: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
// 1. Fetching a conversation for a specific job in chronological order
MessageSchema.index({ job: 1, createdAt: 1 });
// 2. Finding unread messages for a specific user (for inbox notifications)
MessageSchema.index({ receiver: 1, read: 1 });
// 3. Finding all conversations a user is involved in
MessageSchema.index({ sender: 1 });

if (process.env.NODE_ENV !== "production" && models.Message) {
    delete models.Message;
}

export const Message = models.Message || model<IMessage>("Message", MessageSchema);
