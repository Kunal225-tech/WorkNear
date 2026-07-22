import nodemailer from "nodemailer";

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Create a transporter — falls back to console logging in dev if env vars aren't set
const transporter =
    EMAIL_FROM && EMAIL_PASSWORD
        ? nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_FROM,
                pass: EMAIL_PASSWORD,
            },
        })
        : null;

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send an email. Silently logs to console when SMTP credentials are not configured.
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
    if (!transporter) {
        // Dev mode: log the email instead of sending
        console.log("\n─── [Email NOT sent — SMTP not configured] ───");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("────────────────────────────────────────────\n");
        return;
    }

    try {
        await transporter.sendMail({
            from: `"WorkNear" <${EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        // Never crash the app due to an email failure
        console.error("[Mailer] Failed to send email:", error);
    }
}
