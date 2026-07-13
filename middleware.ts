import { auth } from "@/auth";
import type { NextRequest } from "next/server";

interface MiddlewareRequest extends NextRequest {
  auth: unknown;
}

export default auth((req: MiddlewareRequest) => {
  const isLoggedIn = !!req.auth;

  const protectedRoutes: string[] = ["/post-job", "/profile", "/my-jobs"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isLoggedIn && isProtected) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/post-job/:path*", "/profile/:path*", "/my-jobs/:path*"],
};