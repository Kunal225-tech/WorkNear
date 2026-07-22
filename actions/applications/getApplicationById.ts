

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

export async function getApplicationById(applicationId: string) {
  await connectDB();

  const app = await Application.findById(applicationId)
    .populate("job", "postedBy status title location payment requiredDate")
    .populate("applicant", "name email profileImage")
    .lean();

  return app ? JSON.parse(JSON.stringify(app)) : null;
}