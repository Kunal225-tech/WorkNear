import { connectDB } from "@/db/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { loginSchema, LoginInput } from "@/validators/auth.schema";


export async function loginUser(data: LoginInput) {
    try {
        await connectDB();
        const validatedData = loginSchema.safeParse(data);
        if (!validatedData.success) {
            return {
                success: false,
                message: validatedData.error.issues[0].message,
            };
        }

        const { email, password } = validatedData.data;
        const user = await User.findOne({ email });
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }
        const { password: _, ...userWithoutPassword } = user.toObject();
        return {
            success: true,
            message: "User logged in successfully",
            data: userWithoutPassword,
        };
    }
    catch (error) {
        throw error;
    }
}