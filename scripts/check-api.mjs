/**
 * WorkNear Comprehensive API Endpoint Checker
 * Run with: node scripts/check-api.mjs
 * Make sure `npm run dev` is running first.
 */

const BASE = "http://localhost:3000/api";
const results = [];

async function check(label, fn, expectedStatus = 200) {
  try {
    const res = await fn();
    const body = await res.json().catch(() => ({}));
    const isExpected = res.status === expectedStatus || (expectedStatus === 200 && res.ok);
    results.push({ label, status: res.status, ok: isExpected, body });
    console.log(`${isExpected ? "✅" : "❌"} [${res.status}] ${label}`);
    if (!isExpected) console.log("    → Expected:", expectedStatus, "| Got:", res.status, "| Message:", body?.message || JSON.stringify(body));
  } catch (e) {
    results.push({ label, status: "ERR", ok: false, body: e.message });
    console.log(`❌ [ERR] ${label} — ${e.message}`);
  }
}

async function main() {
  console.log("\n====================================");
  console.log(" WorkNear API Check — " + new Date().toLocaleTimeString());
  console.log("====================================\n");

  // ── 1. AUTH ──────────────────────────────────────────────────
  console.log("── AUTH ──");
  const email = `tester_${Date.now()}@test.com`;
  const password = "Password123!";

  await check("POST /api/auth/register (Create Account)", () =>
    fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email, password }),
    }), 200
  );

  await check("GET /api/auth/session (Public Auth Session)", () =>
    fetch(`${BASE}/auth/session`)
  );

  // ── 2. JOBS ───────────────────────────────────────────────────
  console.log("\n── JOBS ──");

  await check("GET /api/jobs (Public Jobs Feed)", () => fetch(`${BASE}/jobs`));

  await check("POST /api/jobs (Unauth → 401)", () =>
    fetch(`${BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test Job", description: "Test", category: "Cleaning", payment: 500, location: "Bangalore", requiredDate: "2025-12-31" }),
    }), 401
  );

  await check("GET /api/jobs/me (Unauth → 401)", () => fetch(`${BASE}/jobs/me`), 401);
  await check("GET /api/jobs/saved (Unauth → 401)", () => fetch(`${BASE}/jobs/saved`), 401);
  await check("POST /api/jobs/bad-id/save (Unauth → 401)", () => fetch(`${BASE}/jobs/bad-id-123/save`, { method: "POST" }), 401);
  await check("GET /api/jobs/bad-id-123 (Invalid ID → 400)", () => fetch(`${BASE}/jobs/bad-id-123`), 400);

  // ── 3. APPLICATIONS ───────────────────────────────────────────
  console.log("\n── APPLICATIONS ──");

  await check("GET /api/applications/me (Unauth → 401)", () => fetch(`${BASE}/applications/me`), 401);
  await check("POST /api/jobs/abc123/apply (Unauth → 401)", () => fetch(`${BASE}/jobs/abc123/apply`, { method: "POST" }), 401);
  await check("PATCH /api/applications/someId/accept (Unauth → 401)", () => fetch(`${BASE}/applications/someId/accept`, { method: "PATCH" }), 401);
  await check("PATCH /api/applications/someId/reject (Unauth → 401)", () => fetch(`${BASE}/applications/someId/reject`, { method: "PATCH" }), 401);
  await check("DELETE /api/applications/someId (Unauth → 401)", () => fetch(`${BASE}/applications/someId`, { method: "DELETE" }), 401);

  // ── 4. REVIEWS ────────────────────────────────────────────────
  console.log("\n── REVIEWS ──");

  await check("POST /api/reviews (Unauth → 401)", () => fetch(`${BASE}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: "123", revieweeId: "456", rating: 5, comment: "Great work!" }) }), 401);
  await check("GET /api/reviews/job/bad-id-123 (Invalid ID → 400)", () => fetch(`${BASE}/reviews/job/bad-id-123`), 400);
  await check("GET /api/reviews/user/bad-id-123 (Invalid ID → 400)", () => fetch(`${BASE}/reviews/user/bad-id-123`), 400);

  // ── 5. USERS ──────────────────────────────────────────────────
  console.log("\n── USERS ──");

  await check("GET /api/users/bad-id-123 (Invalid ID → 400)", () => fetch(`${BASE}/users/bad-id-123`), 400);

  // ── SUMMARY ──────────────────────────────────────────────────
  console.log("\n====================================");
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`  TOTAL: ${results.length} | ✅ PASSED: ${passed} | ❌ FAILED: ${failed}`);
  console.log("====================================\n");
}

main().catch(console.error);
