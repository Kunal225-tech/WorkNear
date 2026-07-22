

import bcrypt from "bcryptjs";

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
import {
    registerSchema,
    RegisterInput,
} from "@/validators/auth.schema";
import { sendMail } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/email-templates";

export async function registerUser(data: RegisterInput) {
    try {
        await connectDB();
        const validatedData = registerSchema.safeParse(data);
        if (!validatedData.success) {
            return {
                success: false,
                message: validatedData.error.issues[0].message,
            };
        }

        const { name, email, password } = validatedData.data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                success: false,
                message: "User already exists",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const { password: _password, ...userWithoutPassword } = user.toObject();

        // Send welcome email (non-blocking)
        try {
            const { subject, html } = welcomeEmail(name);
            await sendMail({ to: email, subject, html });
        } catch (emailErr) {
            console.error("[Email] Failed to send welcome email:", emailErr);
        }

        return {
            success: true,
            message: "User registered successfully",
            user: JSON.parse(JSON.stringify(userWithoutPassword)),
        };
    } catch (error: any) {
        console.error("Error registering user:", error);
        return {
            success: false,
            message: error?.message || "An unexpected error occurred during registration.",
        };
    }
}