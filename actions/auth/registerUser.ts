import bcrypt from "bcryptjs";

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";
import {
    registerSchema,
    RegisterInput,
} from "@/validators/auth.schema";

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
                    message: "User already exists"
                }
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            return {
                success: true,
                message: "User registered successfully",
                user,
            };
        } catch (error) {
            throw error;
        }
    }