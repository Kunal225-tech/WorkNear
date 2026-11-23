import { connectDB } from "@/db/connect";
import { Notification } from "@/models/Notification";
import mongoose from "mongoose";

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return { success: false, message: "Invalid notification ID", code: 400 };
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return { success: false, message: "Notification not found or unauthorized", code: 404 };
    }

    notification.isRead = true;
    await notification.save();

    return {
      success: true,
      message: "Notification marked as read",
      notification: JSON.parse(JSON.stringify(notification)),
    };
  } catch (error) {
    console.error("[Notification] Error marking notification as read:", error);
    return { success: false, message: "Internal server error", code: 500 };
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await connectDB();

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return {
      success: true,
      message: "All notifications marked as read",
    };
  } catch (error) {
    console.error("[Notification] Error marking all notifications as read:", error);
    return { success: false, message: "Internal server error", code: 500 };
  }
}
