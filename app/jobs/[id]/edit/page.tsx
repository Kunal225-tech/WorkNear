"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSession } from "next-auth/react";
import { JOB_CATEGORIES } from "@/constants/jobCategories";

interface JobDetail {
    _id: string;
    title: string;
    description: string;
    category: string;
    payment: number;
    location: string;
    requiredDate: string;
    status: string;
    postedBy: {
        _id: string;
        name: string;
    } | string;
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Cleaning");
    const [payment, setPayment] = useState("");
    const [location, setLocation] = useState("");
    const [requiredDate, setRequiredDate] = useState("");
    const [status, setStatus] = useState("open");

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const res = await fetch(`/api/jobs/${id}`);
                const data = await res.json();
                if (!res.ok || !data.success) {
                    setFetchError(data.message || "Failed to load job specifications");
                } else {
                    const job: JobDetail = data.data;
                    setTitle(job.title);
                    setDescription(job.description);
                    setCategory(job.category);
                    setPayment(String(job.payment));
                    setLocation(job.location);
                    setStatus(job.status);

                    if (job.requiredDate) {
                        const dt = new Date(job.requiredDate);
                        const formatted = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 16);
                        setRequiredDate(formatted);
                    }
                }
            } catch (err: any) {
                setFetchError(err?.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaveError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    payment: Number(payment),
                    location,
                    requiredDate: new Date(requiredDate).toISOString(),
                    status,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setSaveError(data.message || "Failed to update job");
                setSaving(false);
                return;
            }

            setSaveSuccess(true);
            setSaving(false);
            setTimeout(() => {
                router.push(`/jobs/${id}`);
            }, 1200);
        } catch (err: any) {
            setSaveError(err?.message || "An unexpected error occurred");
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Navbar session={session} />
            <div className="grow bg-zinc-50 py-12 dark:bg-zinc-950">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={`/jobs/${id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            &larr; Back to Task Details
                        </Link>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 dark:bg-teal-950 dark:text-teal-400 font-bold text-xl">
                                ✏️
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                    Edit Task Specifications
                                </h1>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Modify job parameters before assigning a local professional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                            <div className="h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
                        </div>
                    ) : fetchError ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/40 dark:bg-red-950/40">
                            <p className="font-bold text-base">{fetchError}</p>
                            <Link
                                href="/my-jobs"
                                className="mt-4 inline-flex rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800"
                            >
                                Return to My Posted Tasks
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                    Update Parameters
                                </span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
                                {saveError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 flex items-center gap-3">
                                        <span>⚠️</span>
                                        <span>{saveError}</span>
                                    </div>
                                )}

                                {saveSuccess && (
                                    <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800 dark:border-teal-900/40 dark:bg-teal-950/60 dark:text-teal-300 flex items-center gap-3 animate-pulse">
                                        <span>🎉</span>
                                        <span>Task updated successfully! Redirecting...</span>
                                    </div>
                                )}

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Task Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        required
                                        minLength={5}
                                        maxLength={100}
                                    />
                                </div>

                                {/* Category & Location */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Service Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        >
                                            {JOB_CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Location / Neighborhood <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                            required
                                            minLength={2}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                {/* Payment, Date & Status */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Payout (₹) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative rounded-xl shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-bold text-zinc-400">
                                                ₹
                                            </div>
                                            <input
                                                type="number"
                                                value={payment}
                                                onChange={(e) => setPayment(e.target.value)}
                                                className="block w-full rounded-xl border border-zinc-300 bg-white pl-8 pr-4 py-3 text-sm text-zinc-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                                required
                                                min={1}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Required Date &amp; Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={requiredDate}
                                            onChange={(e) => setRequiredDate(e.target.value)}
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Task Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm font-semibold text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        >
                                            <option value="open">🟢 Open (Accepting Gigs)</option>
                                            <option value="assigned">🔵 Assigned (In Progress)</option>
                                            <option value="completed">🎉 Completed</option>
                                            <option value="cancelled">⚫ Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Detailed Task Instructions <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        required
                                        minLength={10}
                                        maxLength={1000}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-4">
                                    <Link
                                        href={`/jobs/${id}`}
                                        className="rounded-xl px-5 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={saving || saveSuccess}
                                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                                <span>Saving Changes...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Update Task Specifications</span>
                                                <span>&rarr;</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
