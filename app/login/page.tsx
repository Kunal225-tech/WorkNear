"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid email address or password. Please verify your credentials.");
            return;
        }
        router.push("/");
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="flex min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            {/* Left Column: Brand Context & Value Proposition (Hidden on mobile, visible on lg) */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-zinc-900 p-12 text-white dark:bg-zinc-900 border-r border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-bold text-zinc-950">
                        W
                    </div>
                    <span className="text-xl font-bold tracking-tight">WorkNear</span>
                </div>

                <div className="max-w-md space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-teal-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400"></span>
                        Proximity-Based Job Network
                    </div>
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-100">
                        Connect with verified local professionals right in your neighborhood.
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-400">
                        Whether you need immediate emergency repairs, home relocation assistance, or skilled daily-wage professionals, WorkNear bridges the distance between local talent and community needs.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-left">
                        <div>
                            <div className="text-2xl font-bold text-zinc-100">20+</div>
                            <div className="text-xs text-zinc-400 mt-0.5">Service Categories</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-zinc-100">&lt; 5 km</div>
                            <div className="text-xs text-zinc-400 mt-0.5">Avg Proximity Radius</div>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-zinc-500">
                    &copy; {new Date().getFullYear()} WorkNear Marketplace Inc. All rights reserved.
                </div>
            </div>

            {/* Right Column: Clean Authentication Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-28">
                <div className="mx-auto w-full max-w-sm">
                    {/* Mobile Brand Header */}
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 font-bold text-white dark:bg-teal-500 dark:text-zinc-950">
                            W
                        </div>
                        <span className="text-xl font-bold tracking-tight">WorkNear</span>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Sign in to your account
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your credentials to manage postings or apply for jobs.
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex w-full items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:ring-zinc-100"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.23 1.18-3.25 0-6.01-2.19-7-5.14H1.01v3.15C3.06 21.3 7.23 24 12 24Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5 14.03c-.25-.74-.39-1.54-.39-2.36s.14-1.62.39-2.36V6.16H1.01A11.96 11.96 0 0 0 0 11.67c0 1.92.46 3.74 1.01 5.51l3.99-3.15Z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.83c1.8 0 3.42.62 4.69 1.83l3.52-3.52C18.07 1.19 15.3 0 12 0 7.23 0 3.06 2.7 1.01 6.16l3.99 3.15C6 6.36 8.75 4.83 12 4.83Z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                        </div>
                        <span className="relative bg-white px-3 text-xs text-zinc-400 dark:bg-zinc-950">
                            or continue with email
                        </span>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    Password
                                </label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        Don&apos;t have a WorkNear account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-200"
                        >
                            Register as worker or employer
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}