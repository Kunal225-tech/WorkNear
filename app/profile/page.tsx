"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSession, signOut } from "next-auth/react";

interface Application {
    _id: string;
    job: {
        _id: string;
        title: string;
        location: string;
        payment: number;
        status: string;
    };
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    createdAt: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

    const fetchMyApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/applications/me");
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message || "Failed to load applied jobs");
            } else {
                setApplications(data.data || []);
            }
        } catch (err: any) {
            setError(err?.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyApplications();
    }, []);

    const handleWithdraw = async (applicationId: string) => {
        if (!confirm("Are you sure you want to withdraw this application?")) return;
        setWithdrawingId(applicationId);
        try {
            const res = await fetch(`/api/applications/${applicationId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setApplications((prev) => prev.filter((a) => a._id !== applicationId));
            } else {
                alert(data.message || "Failed to withdraw application");
            }
        } catch (err) {
            alert("An error occurred while withdrawing.");
        } finally {
            setWithdrawingId(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Navbar session={session} />
            <div className="grow bg-zinc-50 py-12 dark:bg-zinc-950">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* User Profile Banner */}
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 mb-10">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5 text-center sm:text-left">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white text-2xl font-extrabold shadow-md">
                                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                                        <span>🛡️ ID &amp; Proximity Verified Pro</span>
                                    </div>
                                    <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {session?.user?.name || "WorkNear Partner"}
                                    </h1>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <Link
                                    href="/profile/edit"
                                    className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-500 transition"
                                >
                                    ✏️ Edit Credentials
                                </Link>
                                {session?.user?.id && (
                                    <Link
                                        href={`/users/${session.user.id}`}
                                        className="rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        👁️ Public Card
                                    </Link>
                                )}
                                <Link
                                    href="/my-jobs"
                                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    My Posted Tasks
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="rounded-xl bg-red-600/10 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-600/20 dark:bg-red-950 dark:text-red-400"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Applied Gigs Section */}
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                                    My Applied Local Gigs
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Track response status from neighborhood employers.
                                </p>
                            </div>
                            <Link
                                href="/"
                                className="text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
                            >
                                Browse More Gigs &rarr;
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-40 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40">
                                <p>{error}</p>
                                <button
                                    onClick={fetchMyApplications}
                                    className="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl text-teal-600 dark:bg-teal-950/50">
                                    🚀
                                </div>
                                <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    You haven&apos;t applied to any gigs yet
                                </h3>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                                    Browse active service requests in your vicinity and apply instantly.
                                </p>
                                <Link
                                    href="/"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                                >
                                    Explore Active Gigs &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {applications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                                                        app.status === "accepted"
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                                            : app.status === "rejected"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                                    }`}
                                                >
                                                    {app.status === "accepted" ? "🎉 Accepted (Hired)" : app.status}
                                                </span>
                                                <span className="text-[11px] font-semibold text-zinc-400">
                                                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                                                {app.job?.title || "Task no longer available"}
                                            </h3>

                                            {app.job && (
                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                                                    <span>📍 {app.job.location}</span>
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                        Payout: ₹{app.job.payment}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                            {app.job ? (
                                                <Link
                                                    href={`/jobs/${app.job._id}`}
                                                    className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
                                                >
                                                    View Task Details &rarr;
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-zinc-400">Archived Task</span>
                                            )}

                                            {app.status === "pending" && (
                                                <button
                                                    onClick={() => handleWithdraw(app._id)}
                                                    disabled={withdrawingId === app._id}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 disabled:opacity-50"
                                                >
                                                    {withdrawingId === app._id ? "Withdrawing..." : "Withdraw Application"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
