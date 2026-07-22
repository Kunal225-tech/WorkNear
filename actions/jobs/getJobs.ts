

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";

export async function getJobs(params?: { lat?: string | null; lng?: string | null; radius?: string | null }) {
  await connectDB();

  let query: any = {};

  if (params?.lat && params?.lng && params?.radius) {
    const radiusInMeters = parseInt(params.radius) * 1000;
    query.locationCoordinates = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(params.lng), parseFloat(params.lat)],
        },
        $maxDistance: radiusInMeters,
      },
    };
  }

  const jobs = await Job.find(query)
    .populate("postedBy", "name profileImage")
    .sort(query.locationCoordinates ? undefined : { createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(jobs));
}