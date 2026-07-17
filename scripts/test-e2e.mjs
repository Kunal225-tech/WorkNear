import fetch from "node-fetch";
import mongoose from "mongoose";

const BASE_URL = "http://localhost:3000";
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/worknear";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, default: "hashedpassword" },
    phone: String,
    bio: String,
    location: String,
    skills: [String],
    isVerified: Boolean,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Job = mongoose.models.Job || mongoose.model("Job", new mongoose.Schema({}, { strict: false }));
const Application = mongoose.models.Application || mongoose.model("Application", new mongoose.Schema({}, { strict: false }));
const Review = mongoose.models.Review || mongoose.model("Review", new mongoose.Schema({}, { strict: false }));

async function runTests() {
    console.log("=====================================================");
    console.log("🚀 STARTING WORKNEAR END-TO-END AUTOMATED TEST SUITE");
    console.log("=====================================================\n");

    let userAId, userBId, jobId, applicationId, reviewId;

    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB directly for setup/teardown");

        // 1. Create Test Users
        const userA = await User.create({
            name: "Rahul Employer",
            email: `rahul.${Date.now()}@test.com`,
            isVerified: true,
            location: "Indiranagar, Bangalore",
        });
        userAId = userA._id.toString();

        const userB = await User.create({
            name: "Amit Pro Worker",
            email: `amit.${Date.now()}@test.com`,
            isVerified: true,
            location: "Indiranagar, Bangalore",
        });
        userBId = userB._id.toString();

        console.log(`[Setup] Created User A (Employer): ${userAId}`);
        console.log(`[Setup] Created User B (Worker):   ${userBId}\n`);

        // Helper for API requests
        const apiRequest = async (method, path, body = null, userId = null) => {
            const headers = { "Content-Type": "application/json" };
            if (userId) headers["x-user-id"] = userId;

            const res = await fetch(`${BASE_URL}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });
            const data = await res.json();
            return { status: res.status, data };
        };

        // 2. Test GET /api/auth/session
        process.stdout.write("Test 1: GET /api/auth/session ... ");
        const { status: s1, data: d1 } = await apiRequest("GET", "/api/auth/session");
        if (s1 === 200 && typeof d1 === "object") {
            console.log("✅ PASS (200 OK, JSON)");
        } else {
            throw new Error(`Failed session check: ${s1} ${JSON.stringify(d1)}`);
        }

        // 3. Test GET /api/users/me (User A)
        process.stdout.write("Test 2: GET /api/users/me (User A) ... ");
        const { status: s2, data: d2 } = await apiRequest("GET", "/api/users/me", null, userAId);
        if (s2 === 200 && d2.success && d2.data.email === userA.email) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed get me: ${JSON.stringify(d2)}`);
        }

        // 4. Test PATCH /api/users/me (User B profile update)
        process.stdout.write("Test 3: PATCH /api/users/me (User B updates skills & bio) ... ");
        const { status: s3, data: d3 } = await apiRequest("PATCH", "/api/users/me", {
            phone: "+91 98765 43210",
            bio: "Certified Electrician and Plumber with 8 years experience.",
            location: "Indiranagar, Bangalore",
            skills: ["Plumbing", "Electrician"],
        }, userBId);
        if (s3 === 200 && d3.success && d3.data.skills.includes("Plumbing")) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed update me: ${JSON.stringify(d3)}`);
        }

        // 5. Test GET /api/users/[id] (Public Profile check)
        process.stdout.write("Test 4: GET /api/users/[id] (Fetch User B public profile) ... ");
        const { status: s4, data: d4 } = await apiRequest("GET", `/api/users/${userBId}`);
        if (s4 === 200 && d4.success && d4.data.name === "Amit Pro Worker" && d4.data.averageRating === 0) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed get public profile: ${JSON.stringify(d4)}`);
        }

        // 6. Test POST /api/jobs (User A posts a job)
        process.stdout.write("Test 5: POST /api/jobs (User A posts a Plumbing repair gig) ... ");
        const { status: s5, data: d5 } = await apiRequest("POST", "/api/jobs", {
            title: "Emergency Kitchen Pipe Leak Repair",
            description: "Water pipe leaking under kitchen sink. Need someone with tools to fix it immediately today.",
            category: "Plumbing",
            payment: 1500,
            location: "Indiranagar, Bangalore",
            requiredDate: new Date(Date.now() + 86400000).toISOString(),
        }, userAId);
        if (s5 === 201 && d5.success && d5.data._id) {
            jobId = d5.data._id;
            console.log(`✅ PASS (Job ID: ${jobId})`);
        } else {
            throw new Error(`Failed post job: ${JSON.stringify(d5)}`);
        }

        // 7. Test GET /api/jobs (Proximity Search)
        process.stdout.write("Test 6: GET /api/jobs?category=Plumbing (Proximity search) ... ");
        const { status: s6, data: d6 } = await apiRequest("GET", "/api/jobs?category=Plumbing");
        if (s6 === 200 && d6.success && d6.data.some(j => j._id === jobId)) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed browse jobs: ${JSON.stringify(d6)}`);
        }

        // 8. Test PATCH /api/jobs/[id] (Update job payment)
        process.stdout.write("Test 7: PATCH /api/jobs/[id] (User A increases payout to ₹1800) ... ");
        const { status: s7, data: d7 } = await apiRequest("PATCH", `/api/jobs/${jobId}`, {
            payment: 1800,
        }, userAId);
        if (s7 === 200 && d7.success && d7.data.payment === 1800) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed patch job: ${JSON.stringify(d7)}`);
        }

        // 9. Test POST /api/jobs/[id]/apply (User B applies)
        process.stdout.write("Test 8: POST /api/jobs/[id]/apply (User B applies to gig) ... ");
        const { status: s8, data: d8 } = await apiRequest("POST", `/api/jobs/${jobId}/apply`, {}, userBId);
        if (s8 === 201 && d8.success && d8.data._id) {
            applicationId = d8.data._id;
            console.log(`✅ PASS (App ID: ${applicationId})`);
        } else {
            throw new Error(`Failed apply job: ${JSON.stringify(d8)}`);
        }

        // 10. Test GET /api/jobs/[id]/applications (User A checks applicant pool)
        process.stdout.write("Test 9: GET /api/jobs/[id]/applications (User A checks applicant pool) ... ");
        const { status: s9, data: d9 } = await apiRequest("GET", `/api/jobs/${jobId}/applications`, null, userAId);
        if (s9 === 200 && d9.success && d9.data.length === 1 && d9.data[0].applicant.name === "Amit Pro Worker") {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed get applications: ${JSON.stringify(d9)}`);
        }

        // 11. Test PATCH /api/applications/[id] (User A accepts User B)
        process.stdout.write("Test 10: PATCH /api/applications/[id] (User A accepts Amit) ... ");
        const { status: s10, data: d10 } = await apiRequest("PATCH", `/api/applications/${applicationId}`, null, userAId);
        if (s10 === 200 && d10.success && d10.data.status === "accepted") {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed accept application: ${JSON.stringify(d10)}`);
        }

        // 12. Test GET /api/jobs/[id] (Verify job status changed to 'assigned')
        process.stdout.write("Test 11: GET /api/jobs/[id] (Verify task state changed to 'assigned') ... ");
        const { status: s11, data: d11 } = await apiRequest("GET", `/api/jobs/${jobId}`);
        if (s11 === 200 && d11.success && d11.data.status === "assigned") {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed verify job state: ${JSON.stringify(d11)}`);
        }

        // 13. Test POST /api/jobs/[id]/status (User A marks task completed)
        process.stdout.write("Test 12: POST /api/jobs/[id]/status (User A marks task as 'completed') ... ");
        const { status: s12, data: d12 } = await apiRequest("POST", `/api/jobs/${jobId}/status`, {
            status: "completed",
        }, userAId);
        if (s12 === 200 && d12.success && d12.data.status === "completed") {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed update status: ${JSON.stringify(d12)}`);
        }

        // 14. Test POST /api/reviews (User A submits 5-star review for User B)
        process.stdout.write("Test 13: POST /api/reviews (User A submits 5-star review for Amit) ... ");
        const { status: s13, data: d13 } = await apiRequest("POST", "/api/reviews", {
            jobId: jobId,
            revieweeId: userBId,
            rating: 5,
            comment: "Amit arrived within 20 minutes and fixed the leak perfectly. 5 stars!",
        }, userAId);
        if (s13 === 201 && d13.success && d13.data.rating === 5) {
            reviewId = d13.data._id;
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed submit review: ${JSON.stringify(d13)}`);
        }

        // 15. Test GET /api/reviews/job/[jobId]
        process.stdout.write("Test 14: GET /api/reviews/job/[id] (Verify review on task) ... ");
        const { status: s14, data: d14 } = await apiRequest("GET", `/api/reviews/job/${jobId}`);
        if (s14 === 200 && d14.success && d14.data.length === 1 && d14.data[0].rating === 5) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed get job reviews: ${JSON.stringify(d14)}`);
        }

        // 16. Test GET /api/users/[id] (Verify User B public rating updated)
        process.stdout.write("Test 15: GET /api/users/[id] (Verify Amit's public card shows 5.0 rating & review count) ... ");
        const { status: s15, data: d15 } = await apiRequest("GET", `/api/users/${userBId}`);
        if (s15 === 200 && d15.success && d15.data.averageRating === 5 && d15.data.reviewCount === 1) {
            console.log("✅ PASS");
        } else {
            throw new Error(`Failed verify updated public card: ${JSON.stringify(d15)}`);
        }

        console.log("\n🎉 ALL 15 END-TO-END WORKFLOW & API TESTS PASSED SUCCESSFULLY! 🎉\n");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message || error);
        process.exitCode = 1;
    } finally {
        // Teardown
        console.log("Cleaning up test documents from MongoDB...");
        if (userAId) await User.findByIdAndDelete(userAId);
        if (userBId) await User.findByIdAndDelete(userBId);
        if (jobId) await Job.findByIdAndDelete(jobId);
        if (applicationId) await Application.findByIdAndDelete(applicationId);
        if (reviewId) await Review.findByIdAndDelete(reviewId);
        await mongoose.disconnect();
        console.log("✅ Teardown complete. Database clean.");
    }
}

runTests();
