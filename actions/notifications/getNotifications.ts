import { connectDB } from "@/db/connect";
import { Notification } from "@/models/Notification";

export interface GetNotificationsParams {
  userId: string;
  limit?: number;
  page?: number;
  unreadOnly?: boolean;
}

export async function getNotifications(params: GetNotificationsParams) {
  try {
    await connectDB();
    const { userId, limit = 20, page = 1, unreadOnly = false } = params;

    const query: Record<string, any> = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name profileImage")
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return {
      success: true,
      data: {
        notifications: JSON.parse(JSON.stringify(notifications)),
        unreadCount,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("[Notification] Error fetching notifications:", error);
    return {
      success: false,
      message: "Failed to fetch notifications",
      data: {
        notifications: [],
        unreadCount: 0,
        total: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}
