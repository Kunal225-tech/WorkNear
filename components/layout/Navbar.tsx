"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarProps {
    session: any;
}

export default function Navbar({ session }: NavbarProps) {
    const pathname = usePathname();
    const [selectedCity, setSelectedCity] = useState("Patna");
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    const cities = ["Patna", "Bangalore", "New Delhi", "Mumbai", "Hyderabad", "Kolkata", "Pune"];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                {/* Left: Brand Logo & Location Picker */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 font-bold text-white">
                            W
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Work<span className="text-teal-600 dark:text-teal-400">Near</span>
                        </span>
                    </Link>

                    {/* Urban Company style Location Dropdown */}
                    <div className="relative hidden md:block">
                        <button
                            type="button"
                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                            className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            <span className="text-teal-600 dark:text-teal-400">📍</span>
                            <span>{selectedCity}</span>
                            <span className="text-[10px] text-zinc-400">▼</span>
                        </button>

                        {isLocationOpen && (
                            <div className="absolute left-0 mt-1.5 w-44 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                    Select Proximity City
                                </div>
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setIsLocationOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs ${
                                            selectedCity === city
                                                ? "bg-teal-50 font-semibold text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
                                                : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                                        }`}
                                    >
                                        <span>{city}</span>
                                        {selectedCity === city && <span>✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Main Navigation */}
                <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    <Link
                        href="/"
                        className={`transition hover:text-zinc-900 dark:hover:text-zinc-100 ${
                            pathname === "/" ? "font-semibold text-teal-600 dark:text-teal-400" : ""
                        }`}
                    >
                        Explore Services
                    </Link>
                    <Link
                        href="/#categories"
                        className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/#how-it-works"
                        className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        How it Works
                    </Link>
                    <Link
                        href="/#trust"
                        className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        Trust & Verification
                    </Link>
                </nav>

                {/* Right: Auth / Profile / Post Job Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <Link
                        href="/post-job"
                        className="hidden sm:inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        + Post a Job
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                    {session.user?.name || "User"}
                                </span>
                                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                                    Verified Member
                                </span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/login"
                                className="px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
