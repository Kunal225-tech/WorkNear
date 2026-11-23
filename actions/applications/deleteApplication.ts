import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

export async function deleteApplication(applicationId: string) {
  await connectDB();
  const deleted = await Application.findByIdAndDelete(applicationId).lean();
  return deleted ? JSON.parse(JSON.stringify(deleted)) : null;
}