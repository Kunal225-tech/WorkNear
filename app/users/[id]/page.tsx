"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSession } from "next-auth/react";

interface ReviewItem {
    _id: string;
    rating: number;
    comment: string;
    reviewer: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    createdAt: string;
}

interface UserProfileDetail {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    isVerified?: boolean;
    averageRating: number;
    reviewCount: number;
    reviews: ReviewItem[];
    createdAt: string;
}

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();

    const [user, setUser] = useState<UserProfileDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/users/${id}`);
                const data = await res.json();
                if (!res.ok || !data.success) {
                    setError(data.message || "Failed to load public profile");
                } else {
                    setUser(data.data);
                }
            } catch (err: any) {
                setError(err?.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Navbar session={session} />
            <div className="grow bg-zinc-50 py-12 dark:bg-zinc-950">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                            <div className="h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                        </div>
                    ) : error || !user ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/40 dark:bg-red-950/40">
                            <p className="font-bold text-base">{error || "User not found"}</p>
                            <Link
                                href="/jobs"
                                className="mt-4 inline-flex rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800"
                            >
                                Browse Local Gigs
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Profile Header Card */}
                            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="h-32 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-900 dark:to-emerald-950/80" />
                                <div className="px-6 pb-6 pt-0 sm:px-8 -mt-14 sm:flex sm:items-end sm:justify-between">
                                    <div className="flex items-end gap-5">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-teal-600 text-3xl font-extrabold text-white shadow-md dark:border-zinc-900">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="pb-2">
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                                    {user.name}
                                                </h1>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                                    🛡️ Verified Pro
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                                Member since {new Date(user.createdAt).toLocaleDateString([], { month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating Badge */}
                                    <div className="mt-4 sm:mt-0 rounded-2xl bg-zinc-50 p-4 border border-zinc-200 text-center sm:text-right dark:bg-zinc-800/60 dark:border-zinc-700/80 shrink-0">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                            Customer Rating
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-1">
                                            <span className="text-amber-500 text-2xl font-extrabold">★</span>
                                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                                {user.averageRating || "New"}
                                            </span>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                                                ({user.reviewCount} {user.reviewCount === 1 ? "review" : "reviews"})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-100 px-6 py-6 sm:px-8 dark:border-zinc-800 space-y-6">
                                    {/* Location & Contact */}
                                    <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-600 dark:text-zinc-300">
                                        {user.location && (
                                            <div className="flex items-center gap-1.5 font-semibold">
                                                <span>📍 Neighborhood:</span>
                                                <span className="text-zinc-900 dark:text-zinc-100 font-bold">{user.location}</span>
                                            </div>
                                        )}
                                        {user.phone && (
                                            <div className="flex items-center gap-1.5 font-semibold">
                                                <span>📞 Verified Phone:</span>
                                                <span className="text-zinc-900 dark:text-zinc-100 font-bold">{user.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    {user.bio ? (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                                Professional Bio &amp; Credentials
                                            </h3>
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                                                {user.bio}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 italic">No bio provided yet.</p>
                                    )}

                                    {/* Skills */}
                                    {user.skills && user.skills.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                                                Verified Trades &amp; Specialties
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-xl bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-teal-800 border border-teal-200/60 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/50"
                                                    >
                                                        ✓ {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                    <span>Verified Customer Reviews</span>
                                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                        {user.reviews.length}
                                    </span>
                                </h2>

                                {user.reviews.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
                                        <span className="text-3xl block mb-2">💬</span>
                                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                            No reviews yet
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Reviews appear here automatically after completed neighborhood gigs.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {user.reviews.map((rev) => (
                                            <div
                                                key={rev._id}
                                                className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs">
                                                            {rev.reviewer?.name?.charAt(0).toUpperCase() || "C"}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                                {rev.reviewer?.name || "Verified Customer"}
                                                            </div>
                                                            <div className="text-[10px] text-zinc-400">
                                                                {new Date(rev.createdAt).toLocaleDateString([], { dateStyle: "medium" })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                        <span>★</span>
                                                        <span>{rev.rating}.0</span>
                                                    </div>
                                                </div>

                                                <p className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                    &ldquo;{rev.comment}&rdquo;
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
