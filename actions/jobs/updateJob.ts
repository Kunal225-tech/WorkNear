

import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import "@/models/User";
import { UpdateJobInput } from "@/validators/job.schema";
import { geocodeLocation } from "@/lib/geocode";

interface UpdateJobParams extends UpdateJobInput {
    jobId: string;
}

export async function updateJob({
    jobId,
    ...jobData
}: UpdateJobParams) {
    await connectDB();

    let updatePayload: any = { ...jobData };

    if (jobData.location) {
        const coords = await geocodeLocation(jobData.location);
        if (coords) {
            updatePayload.locationCoordinates = {
                type: 'Point',
                coordinates: coords,
            };
        }
    }

    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        updatePayload,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("postedBy", "name profileImage")
        .lean();

    return updatedJob ? JSON.parse(JSON.stringify(updatedJob)) : null;
}