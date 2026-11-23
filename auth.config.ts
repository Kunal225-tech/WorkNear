import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    providers: [],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const nextUrl = (request as any)?.nextUrl;
            if (!nextUrl || !nextUrl.pathname) return true;
            const protectedRoutes = ["/dashboard", "/post-job", "/profile", "/my-jobs", "/my-applications", "/jobs"];
            const isProtected = protectedRoutes.some((route) =>
                nextUrl.pathname.startsWith(route)
            );

            if (isProtected && !isLoggedIn) {
                return Response.redirect(new URL("/login", nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
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
} satisfies NextAuthConfig;
