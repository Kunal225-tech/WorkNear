const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

const brandColor = "#2563eb";
const brandName = "WorkNear";

function baseLayout(content: string) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${brandName}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:${brandColor};padding:28px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">${brandName}</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Find Local Jobs &amp; Hire Nearby Talent</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
              &copy; ${new Date().getFullYear()} ${brandName} &mdash; Connecting Communities
              <br/>
              <a href="${BASE_URL}" style="color:${brandColor};text-decoration:none;">Visit WorkNear</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string) {
    return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:${brandColor};color:#ffffff;font-weight:700;font-size:14px;border-radius:10px;text-decoration:none;">${label}</a>`;
}

// ─── Template: Welcome Email ─────────────────────────────────────────────────
export function welcomeEmail(name: string) {
    return {
        subject: `Welcome to ${brandName}, ${name}! 🎉`,
        html: baseLayout(`
            <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Hey ${name}, welcome aboard! 👋</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
                You've just joined <strong>${brandName}</strong> — the local marketplace connecting community members with trusted service providers nearby.
            </p>
            <p style="margin:0 0 8px;font-size:14px;color:#475569;line-height:1.6;">Here's what you can do:</p>
            <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#475569;line-height:2;">
                <li>🔍 Browse local jobs in your neighborhood</li>
                <li>📋 Post a task and hire trusted workers</li>
                <li>💼 Apply to gigs and earn money locally</li>
            </ul>
            ${ctaButton(`${BASE_URL}/jobs`, "Explore Local Jobs →")}
        `),
    };
}

// ─── Template: New Application Received ─────────────────────────────────────
export function newApplicationEmail(posterName: string, jobTitle: string, applicantName: string, jobId: string) {
    return {
        subject: `New Application on "${jobTitle}" — ${brandName}`,
        html: baseLayout(`
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">You have a new applicant! 🙌</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
                Hi <strong>${posterName}</strong>, <strong>${applicantName}</strong> has submitted a proposal for your job listing:
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:16px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#1e40af;">${jobTitle}</p>
            </div>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
                Review their proposal and decide whether to accept or reject it from your dashboard.
            </p>
            ${ctaButton(`${BASE_URL}/jobs/${jobId}`, "View Applicant →")}
        `),
    };
}

// ─── Template: Application Accepted ─────────────────────────────────────────
export function applicationAcceptedEmail(applicantName: string, jobTitle: string, posterName: string, jobId: string) {
    return {
        subject: `🎉 You've been accepted for "${jobTitle}"!`,
        html: baseLayout(`
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">Congratulations, ${applicantName}! 🎉</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
                Your application has been <strong style="color:#16a34a;">accepted</strong> by <strong>${posterName}</strong> for the following job:
            </p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:16px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#16a34a;">${jobTitle}</p>
            </div>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
                You can now contact the poster and coordinate the details. Good luck!
            </p>
            ${ctaButton(`${BASE_URL}/jobs/${jobId}`, "View Job Details →")}
        `),
    };
}

// ─── Template: Application Rejected ─────────────────────────────────────────
export function applicationRejectedEmail(applicantName: string, jobTitle: string, jobId: string) {
    return {
        subject: `Update on your application for "${jobTitle}"`,
        html: baseLayout(`
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">Application Update</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
                Hi <strong>${applicantName}</strong>, unfortunately your application for the following job was not selected this time:
            </p>
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:16px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#dc2626;">${jobTitle}</p>
            </div>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
                Don't be discouraged! There are plenty of local opportunities waiting for you. Keep applying!
            </p>
            ${ctaButton(`${BASE_URL}/jobs`, "Browse More Jobs →")}
        `),
    };
}
