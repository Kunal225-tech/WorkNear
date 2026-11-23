

import { connectDB } from "@/db/connect";
import { Review } from "@/models/Review";
import { Job } from "@/models/Job";
import { User } from "@/models/User";
import { Application } from "@/models/Application";

interface CreateReviewInput {
    jobId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment: string;
}

export async function createReview({
    jobId,
    reviewerId,
    revieweeId,
    rating,
    comment,
}: CreateReviewInput) {
    await connectDB();

    // Verify job is completed or assigned
    const job = await Job.findById(jobId).lean();
    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "completed") {
        throw new Error("Reviews can only be submitted for completed tasks");
    }

    // Validate review target
    const postedById = typeof job.postedBy === "object" && job.postedBy !== null && "_id" in job.postedBy
        ? String(job.postedBy._id)
        : String(job.postedBy);

    const acceptedApp = await Application.findOne({ job: jobId, status: "accepted" }).lean();
    if (!acceptedApp) {
        throw new Error("This job does not have an assigned worker yet");
    }

    const assignedWorkerId = typeof acceptedApp.applicant === "object" && acceptedApp.applicant !== null && "_id" in acceptedApp.applicant
        ? String(acceptedApp.applicant._id)
        : String(acceptedApp.applicant);

    if (reviewerId === postedById) {
        if (revieweeId !== assignedWorkerId) {
            throw new Error("As the job poster, you can only review the assigned worker");
        }
    } else if (reviewerId === assignedWorkerId) {
        if (revieweeId !== postedById) {
            throw new Error("As the assigned worker, you can only review the job poster");
        }
    } else {
        throw new Error("You are not authorized to leave a review for this job");
    }

    // Check if a review already exists
    const existing = await Review.findOne({
        job: jobId,
        reviewer: reviewerId,
        reviewee: revieweeId,
    }).lean();

    if (existing) {
        throw new Error("You have already submitted a review for this task and person");
    }

    const review = await Review.create({
        job: jobId,
        reviewer: reviewerId,
        reviewee: revieweeId,
        rating,
        comment,
    });

    // Update the reviewee's average rating and review count
    const allReviews = await Review.find({ reviewee: revieweeId }).lean();
    const reviewCount = allReviews.length;
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    await User.findByIdAndUpdate(revieweeId, {
        averageRating: Number(averageRating.toFixed(2)),
        reviewCount,
    });

    const populatedReview = await Review.findById(review._id)
        .populate("reviewer", "name profileImage")
        .lean();

    return JSON.parse(JSON.stringify(populatedReview));
}
