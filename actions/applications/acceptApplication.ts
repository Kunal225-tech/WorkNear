

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";

export async function acceptApplication(applicationId: string) {
    await connectDB();
    const application = await Application.findByIdAndUpdate(
        applicationId,
        {
            status: "accepted",
        },
        {
            new: true,
        }
    ).lean();

    if (!application) {
        return null;
    }
    await Job.findByIdAndUpdate(application.job, {
        status: "assigned",
    });
    await Application.updateMany(
        {
            job: application.job,
            _id: { $ne: applicationId },
            status: "pending",
        },
        {
            $set: {
                status: "rejected",
            },
        }
    );

    return JSON.parse(JSON.stringify(application));
}