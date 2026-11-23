import { connectDB } from "@/db/connect";
import { Notification, NotificationType } from "@/models/Notification";

export interface CreateNotificationParams {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    await connectDB();
    const notification = await Notification.create({
      recipient: params.recipientId,
      sender: params.senderId || undefined,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      isRead: false,
    });

    return {
      success: true,
      notification: JSON.parse(JSON.stringify(notification)),
    };
  } catch (error) {
    console.error("[Notification] Error creating notification:", error);
    return {
      success: false,
      message: "Failed to create notification",
    };
  }
}
