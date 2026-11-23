import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "./db/connect";
import { User } from "./models/User";
import { authConfig } from "./auth.config";

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable is not set. Application cannot start.");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                await connectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    return null;
                }
                const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                if (!isMatch) {
                    return null;
                }
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.profileImage,
                };
            },
        }),

        Google({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                try {
                    await connectDB();
                    let dbUser = await User.findOne({ email: user.email });
                    if (!dbUser) {
                        dbUser = await User.create({
                            name: user.name || "Google User",
                            email: user.email,
                            profileImage: user.image || "",
                            isVerified: true,
                            authProvider: "google",
                        });
                    }
                    user.id = dbUser._id.toString();
                    return true;
                } catch (error) {
                    console.error("Error saving Google OAuth user to MongoDB:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                if (account?.provider === "google" && user.email) {
                    await connectDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                    } else {
                        token.id = user.id;
                    }
                } else {
                    token.id = user.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                (session.user as typeof session.user & { id?: string }).id = token.id as string;
            }
            return session;
        },
    },
});