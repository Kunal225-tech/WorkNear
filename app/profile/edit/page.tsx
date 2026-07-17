"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSession } from "next-auth/react";
import { JOB_CATEGORIES } from "@/constants/jobCategories";

export default function EditProfilePage() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [skills, setSkills] = useState<string[]>([]);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const res = await fetch("/api/users/me");
                const data = await res.json();
                if (!res.ok || !data.success) {
                    setFetchError(data.message || "Failed to load profile details");
                } else {
                    const u = data.data;
                    setName(u.name || "");
                    setPhone(u.phone || "");
                    setBio(u.bio || "");
                    setLocation(u.location || "");
                    setSkills(Array.isArray(u.skills) ? u.skills : []);
                }
            } catch (err: any) {
                setFetchError(err?.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const toggleSkill = (skill: string) => {
        setSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaveError(null);
        setSaving(true);

        try {
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    bio,
                    location,
                    skills,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setSaveError(data.message || "Failed to update profile");
                setSaving(false);
                return;
            }

            setSaveSuccess(true);
            setSaving(false);

            // Update session if available
            await updateSession();

            setTimeout(() => {
                router.push("/profile");
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
                            href="/profile"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            &larr; Back to Profile Dashboard
                        </Link>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 dark:bg-teal-950 dark:text-teal-400 font-bold text-xl">
                                🛠️
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                    Edit Profile &amp; Service Credentials
                                </h1>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Update your bio, neighborhood location, and service skills so homeowners can hire you directly.
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
                                href="/profile"
                                className="mt-4 inline-flex rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800"
                            >
                                Return to Profile
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                    Verified Member Credentials
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
                                        <span>Profile credentials saved successfully! Redirecting...</span>
                                    </div>
                                )}

                                {/* Name & Phone */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                            required
                                            minLength={2}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Contact Phone / WhatsApp Number
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="e.g. +91 98765 43210"
                                            className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Neighborhood &amp; City (Proximity Radius)
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Indiranagar, Bangalore OR Kankarbagh, Patna"
                                        className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Professional Bio &amp; Experience
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Briefly describe your trades, experience, punctuality, and tools you carry..."
                                        className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                        maxLength={500}
                                    />
                                    <span className="text-[11px] text-zinc-400 mt-1 block">
                                        {bio.length}/500 characters
                                    </span>
                                </div>

                                {/* Skills / Categories */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                                        Select Your Service Skills &amp; Trades
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {JOB_CATEGORIES.map((cat) => {
                                            const isSelected = skills.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleSkill(cat)}
                                                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                    }`}
                                                >
                                                    <span>{isSelected ? "✓" : "+"}</span>
                                                    <span>{cat}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-4">
                                    <Link
                                        href="/profile"
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
                                                <span>Saving Credentials...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Save &amp; Publish Profile</span>
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
