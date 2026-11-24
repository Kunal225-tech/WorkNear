import { signIn, signOut } from "next-auth/react";
import api from "@/lib/axios";
import type { ApiResponse, RegisterInput, LoginInput } from "@/types";

export const authService = {
  /**
   * Register a new user with credentials.
   * POST /api/auth/register
   */
  async register(data: RegisterInput): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Login using NextAuth credentials provider.
   * This calls NextAuth's signIn() directly rather than a custom API route.
   */
  async login(data: LoginInput): Promise<{ ok: boolean; error?: string }> {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result) {
      return { ok: false, error: "Login failed. Please try again." };
    }

    return {
      ok: !result.error,
      error: result.error
        ? result.error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : result.error
        : undefined,
    };
  },

  /**
   * Login with Google OAuth.
   * Redirects to Google consent screen.
   */
  async loginWithGoogle(callbackUrl: string = "/jobs"): Promise<void> {
    await signIn("google", { callbackUrl });
  },

  /**
   * Logout the current user.
   */
  async logout(): Promise<void> {
    await signOut({ callbackUrl: "/" });
  },
};
