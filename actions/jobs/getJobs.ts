import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";

export async function getJobs(params?: { lat?: string | null; lng?: string | null; radius?: string | null }) {
  await connectDB();

  const hasGeoFilter =
    params?.lat && params?.lng && params?.radius && params.radius !== "ALL";

  if (hasGeoFilter) {
    const radiusInMeters = parseInt(params.radius!) * 1000;
    const geoQuery = {
      status: "open",
      locationCoordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(params.lng!), parseFloat(params.lat!)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    const nearbyJobs = await Job.find(geoQuery)
      .populate("postedBy", "name profileImage")
      .lean();

    return {
      jobs: JSON.parse(JSON.stringify(nearbyJobs)),
      nearbyMatch: nearbyJobs.length > 0,
    };
  }

  const jobs = await Job.find({ status: "open" })
    .populate("postedBy", "name profileImage")
    .sort({ createdAt: -1 })
    .lean();

  return {
    jobs: JSON.parse(JSON.stringify(jobs)),
    nearbyMatch: false,
  };
}