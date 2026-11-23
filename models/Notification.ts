import { Schema, model, models } from "mongoose";

export const NOTIFICATION_TYPES = [
  "application_received",
  "application_accepted",
  "application_rejected",
  "job_completed",
  "system",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const NotificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index optimized for retrieving user's newest notifications
NotificationSchema.index({ recipient: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production" && models.Notification) {
  delete models.Notification;
}

export const Notification = models.Notification || model("Notification", NotificationSchema);
