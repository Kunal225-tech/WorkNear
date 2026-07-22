

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

export async function rejectApplication(applicationId: string) {
  await connectDB();

  const app = await Application.findByIdAndUpdate(
    applicationId,
    {
      status: "rejected",
    },
    {
      new: true,
    }
  ).lean();

  return app ? JSON.parse(JSON.stringify(app)) : null;
}