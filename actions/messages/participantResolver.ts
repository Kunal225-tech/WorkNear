import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";

export interface ResolvedParticipants {
    job: any; // the populated job document
    senderId: string;
    receiverId: string;
}

export async function resolveMessagingParticipants(
    jobId: string,
    currentUserId: string
): Promise<ResolvedParticipants> {
    await connectDB();

    const job = await Job.findById(jobId).lean();
    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "assigned" && job.status !== "completed") {
        throw new Error("Messaging is only available for assigned or completed jobs");
    }

    const acceptedApp = await Application.findOne({
        job: jobId,
        status: "accepted",
    }).lean();

    if (!acceptedApp) {
        throw new Error("No accepted worker found for this job");
    }

    const postedById =
        typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
            ? String(job.postedBy._id)
            : String(job.postedBy);

    const workerId =
        typeof acceptedApp.applicant === "object" && acceptedApp.applicant !== null && "_id" in acceptedApp.applicant
            ? String(acceptedApp.applicant._id)
            : String(acceptedApp.applicant);

    let receiverId: string;

    if (currentUserId === postedById) {
        receiverId = workerId;
    } else if (currentUserId === workerId) {
        receiverId = postedById;
    } else {
        throw new Error("You are not authorized to participate in this conversation");
    }

    return {
        job,
        senderId: currentUserId,
        receiverId,
    };
}
