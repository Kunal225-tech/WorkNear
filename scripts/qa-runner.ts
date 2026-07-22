import axios from "axios";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE,
    validateStatus: () => true, // Don't throw on non-200 status
});

// Helper to set auth header
const setAuth = (userId: string) => {
    api.defaults.headers.common["x-user-id"] = userId;
};

// Colors for output
const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
};

let passed = 0;
let failed = 0;
const errors: string[] = [];

const assert = (condition: boolean, message: string) => {
    if (condition) {
        console.log(`${colors.green}✅ PASS: ${message}${colors.reset}`);
        passed++;
    } else {
        console.error(`${colors.red}❌ FAIL: ${message}${colors.reset}`);
        errors.push(message);
        failed++;
    }
};

async function runQA() {
    console.log("🚀 Starting E2E QA Test...");

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined.");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    try {
        // 1. Setup Mock Users
        const User = mongoose.connection.collection("users");
        
        const userA = { _id: new mongoose.Types.ObjectId(), name: "QA Poster A", email: "qaa@test.com", reviewCount: 0, averageRating: 0 };
        const userB = { _id: new mongoose.Types.ObjectId(), name: "QA Worker B", email: "qab@test.com", reviewCount: 0, averageRating: 0 };
        const userC = { _id: new mongoose.Types.ObjectId(), name: "QA Worker C", email: "qac@test.com", reviewCount: 0, averageRating: 0 };

        await User.insertMany([userA, userB, userC]);
        console.log("Created mock users.");

        // 2. Job Posting
        setAuth(userA._id.toString());
        const jobRes = await api.post("/jobs", {
            title: "Test Job QA",
            description: "A test job for QA testing workflows.",
            category: "Delivery",
            payment: 100,
            location: "New York",
            requiredDate: new Date(Date.now() + 86400000).toISOString(),
        });
        
        assert(jobRes.status === 201, "User A can create a job.");
        const jobId = jobRes.data?.data?._id;
        assert(jobRes.data?.data?.status === "open", "Default status is 'open'.");

        // 3. Unauthorized Apply (Poster applies to own job)
        const applySelfRes = await api.post(`/jobs/${jobId}/apply`);
        assert(applySelfRes.status === 403, "Poster CANNOT apply to their own job.");

        // 4. Job Application
        setAuth(userB._id.toString());
        const applyRes1 = await api.post(`/jobs/${jobId}/apply`);
        assert(applyRes1.status === 201, "User B can apply to the job.");
        
        const applyRes2 = await api.post(`/jobs/${jobId}/apply`);
        assert(applyRes2.status === 409, "User B CANNOT submit duplicate applications.");

        setAuth(userC._id.toString());
        const applyRes3 = await api.post(`/jobs/${jobId}/apply`);
        assert(applyRes3.status === 201, "User C can apply to the job independently.");

        // Fetch applications to get IDs
        setAuth(userA._id.toString());
        const appsRes = await api.get(`/jobs/${jobId}/applications`);
        const apps = appsRes.data?.data || [];
        assert(apps.length === 2, "Poster can see both applications.");
        
        const appB = apps.find((a: any) => a.applicant._id === userB._id.toString());
        const appC = apps.find((a: any) => a.applicant._id === userC._id.toString());

        // 5. Applicant Management (Acceptance)
        // Unauthorized accept attempt (Worker B trying to accept Worker C)
        setAuth(userB._id.toString());
        const unauthorizedAcceptRes = await api.patch(`/applications/${appC?._id}/accept`);
        assert(unauthorizedAcceptRes.status === 403 || unauthorizedAcceptRes.status === 401, "Worker CANNOT accept applications.");

        // Valid accept
        setAuth(userA._id.toString());
        const acceptRes = await api.patch(`/applications/${appB?._id}/accept`);
        assert(acceptRes.status === 200, "Poster can accept User B's application.");
        
        // Verify Job status in DB
        const Job = mongoose.connection.collection("jobs");
        const Application = mongoose.connection.collection("applications");
        
        const updatedJob = await Job.findOne({ _id: new mongoose.Types.ObjectId(jobId) });
        assert(updatedJob?.status === "assigned", "Job status automatically changed to 'assigned'.");

        const updatedAppC = await Application.findOne({ _id: new mongoose.Types.ObjectId(appC?._id) });
        assert(updatedAppC?.status === "rejected", "Other pending applications automatically marked 'rejected'.");

        // 6. Job Completion
        // Unauthorized completion attempt
        setAuth(userB._id.toString());
        const unauthorizedCompleteRes = await api.patch(`/jobs/${jobId}`, { status: "completed" });
        assert(unauthorizedCompleteRes.status === 403, "Worker CANNOT mark job as completed.");

        // Valid completion
        setAuth(userA._id.toString());
        const completeRes = await api.patch(`/jobs/${jobId}`, { status: "completed" });
        assert(completeRes.status === 200, "Poster can mark job as completed.");

        // 7. Ratings & Reviews
        // Valid review
        setAuth(userA._id.toString());
        const reviewRes = await api.post(`/reviews`, {
            jobId,
            reviewerId: userA._id.toString(),
            revieweeId: userB._id.toString(),
            rating: 5,
            comment: "Excellent work."
        });
        
        assert(reviewRes.status === 201 || reviewRes.status === 200, "Poster can review the worker.");

        // Unauthorized review attempt (User A reviews User B AGAIN)
        const duplicateReviewRes = await api.post(`/reviews`, {
            jobId,
            reviewerId: userA._id.toString(),
            revieweeId: userB._id.toString(),
            rating: 4,
            comment: "Wait here's another review."
        });
        assert(duplicateReviewRes.status === 409 || duplicateReviewRes.status === 400 || duplicateReviewRes.status === 500, "Poster CANNOT review the same worker multiple times for the same job.");

        // Verify rating calculations directly in DB
        const updatedUserB = await User.findOne({ _id: userB._id });
        assert(updatedUserB?.averageRating === 5, "Worker averageRating updated correctly to 5.");
        assert(updatedUserB?.reviewCount === 1, "Worker reviewCount updated correctly to 1.");

        // Clean up mock data
        await User.deleteMany({ _id: { $in: [userA._id, userB._id, userC._id] } });
        await Job.deleteOne({ _id: new mongoose.Types.ObjectId(jobId) });
        await Application.deleteMany({ job: new mongoose.Types.ObjectId(jobId) });
        await mongoose.connection.collection("reviews").deleteMany({ job: new mongoose.Types.ObjectId(jobId) });
        console.log("Cleaned up mock data.");
        
        console.log(`\nQA Run Complete. Passed: ${passed}, Failed: ${failed}`);
        if (failed > 0) {
            console.error("\nFailing issues:");
            errors.forEach(e => console.error(`- ${e}`));
        }

    } catch (err) {
        console.error("QA Test Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runQA();
