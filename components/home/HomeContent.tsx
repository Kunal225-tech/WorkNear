"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomeContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        { name: "Plumbing", icon: "🔧", desc: "Pipe leaks, tap replacement, bathroom fittings" },
        { name: "Electrician", icon: "⚡", desc: "Wiring repair, switchboard installation, MCB fix" },
        { name: "Home Cleaning", icon: "✨", desc: "Deep house cleaning, kitchen sanitization, sofa shampoo" },
        { name: "AC & Appliance", icon: "❄️", desc: "AC servicing, gas refill, washing machine & fridge repair" },
        { name: "House Shifting", icon: "🚚", desc: "Movers & packers, furniture assembly, transport assistance" },
        { name: "Carpenter", icon: "🪚", desc: "Custom woodwork, door lock fix, modular furniture setup" },
        { name: "Painting", icon: "🎨", desc: "Interior room painting, waterproofing, putty & touch-ups" },
        { name: "General Labor", icon: "🏗️", desc: "Daily-wage assistance, warehouse loading, construction help" },
    ];

    const sampleJobs = [
        {
            id: "job-1",
            title: "Emergency Kitchen Sink Pipe & Valve Replacement",
            category: "Plumbing",
            location: "Kankarbagh, Patna",
            distance: "1.8 km away",
            payout: "₹650",
            payoutType: "Fixed",
            requiredDate: "Today, 4:00 PM",
            status: "Urgent",
        },
        {
            id: "job-2",
            title: "Complete 3 BHK Deep House Sanitization & Cleaning",
            category: "Home Cleaning",
            location: "Indiranagar, Bangalore",
            distance: "2.4 km away",
            payout: "₹2,400",
            payoutType: "Fixed",
            requiredDate: "Tomorrow, 10:00 AM",
            status: "Open",
        },
        {
            id: "job-3",
            title: "Split AC General Servicing & Filter Wash (2 Units)",
            category: "AC & Appliance",
            location: "Boring Road, Patna",
            distance: "3.1 km away",
            payout: "₹800",
            payoutType: "Fixed",
            requiredDate: "Within 24 Hours",
            status: "Open",
        },
    ];

    const filteredJobs = activeCategory === "All" 
        ? sampleJobs 
        : sampleJobs.filter(j => j.category.toLowerCase().includes(activeCategory.toLowerCase()));

    return (
        <main className="bg-transparent text-zinc-900 dark:text-zinc-100">
            {/* 1. HERO SECTION (Urban Company style split layout with working professionals) */}
            <section className="relative overflow-hidden border-b border-zinc-200/80 pb-16 pt-10 dark:border-zinc-800/80 lg:pb-24 lg:pt-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        
                        {/* Left Hero Content */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-500/30 dark:bg-teal-950/50 dark:text-teal-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
                                <span>Verified Proximity Network {" • "} Average Arrival &lt; 30 Mins</span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
                                Home services &amp; local skilled professionals,{" "}
                                <span className="text-teal-600 dark:text-teal-400">on demand.</span>
                            </h1>

                            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
                                Book verified local electricians, plumbers, house cleaners, appliance repair specialists, and daily-wage professionals right in your neighborhood with upfront fixed pricing.
                            </p>

                            {/* Urban Company style Search Box */}
                            <div className="mt-8 max-w-xl">
                                <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-zinc-300 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                                    <div className="flex w-full items-center gap-3 px-3 py-1.5 text-zinc-400">
                                        <svg className="h-5 w-5 shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="What service do you need? e.g. AC Repair, Plumber..."
                                            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100"
                                        />
                                    </div>
                                    <Link
                                        href={`/post-job?category=${encodeURIComponent(searchQuery)}`}
                                        className="w-full sm:w-auto shrink-0 rounded-lg bg-zinc-900 px-6 py-3 text-center text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-teal-600 dark:hover:bg-teal-700"
                                    >
                                        Find Professional
                                    </Link>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Popular:</span>
                                    <button onClick={() => setSearchQuery("Plumbing")} className="hover:text-teal-600 underline">Plumber</button>
                                    <span>{" • "}</span>
                                    <button onClick={() => setSearchQuery("Electrician")} className="hover:text-teal-600 underline">Electrician</button>
                                    <span>{" • "}</span>
                                    <button onClick={() => setSearchQuery("Home Cleaning")} className="hover:text-teal-600 underline">Deep Cleaning</button>
                                    <span>{" • "}</span>
                                    <button onClick={() => setSearchQuery("AC & Appliance")} className="hover:text-teal-600 underline">AC Servicing</button>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Collage (Real Working Professionals from Unsplash) */}
                        <div className="lg:col-span-5">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {/* Photo 1: Electrician / Technician */}
                                    <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-md aspect-4/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                                            alt="Verified Electrician working on wiring"
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>
                                    {/* Photo 2: Home Cleaner / Sanitization Pro */}
                                    <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-md aspect-4/5 mt-6">
                                        <img
                                            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                                            alt="Professional Home Cleaner"
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>
                                    {/* Photo 3: Skilled Handyman / Carpenter */}
                                    <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-md aspect-4/5 -mt-6">
                                        <img
                                            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80"
                                            alt="Skilled Handyman with tools"
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>
                                    {/* Photo 4: Plumber / Pipe Technician */}
                                    <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-md aspect-4/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                                            alt="Plumbing Technician inspecting pipe"
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>
                                </div>

                                {/* Floating Verification Badge overlay */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-11/12 sm:w-auto rounded-xl border border-zinc-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-sm">
                                            🛡️
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                100% Background &amp; ID Verified
                                            </div>
                                            <div className="text-[11px] text-zinc-500">
                                                <span>Strict proximity matching {" • "} Fixed upfront payouts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. TOP CORE CATEGORY CARDS (Urban Company style grid) */}
            <section id="categories" className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                Explore Core Service Categories
                            </h2>
                            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                                Pick from our standardized local trades and immediate service options.
                            </p>
                        </div>
                        <Link
                            href="/post-job"
                            className="mt-4 sm:mt-0 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
                        >
                            View All 20+ Categories &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/post-job?category=${encodeURIComponent(cat.name)}`}
                                className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-500"
                            >
                                <div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 text-2xl transition group-hover:bg-teal-50 dark:bg-zinc-800 dark:group-hover:bg-teal-950/50">
                                        {cat.icon}
                                    </div>
                                    <h3 className="mt-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                        {cat.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400">
                                        {cat.desc}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] font-semibold text-zinc-400 group-hover:text-teal-600 dark:border-zinc-800 dark:group-hover:text-teal-400">
                                    <span>Book or Post Task</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. RECENT OPEN GIGS NEAR YOU (Live task sample showcase) */}
            <section className="border-t border-zinc-200/80 bg-transparent py-16 dark:border-zinc-800/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                                Live Proximity Feed Sample
                            </div>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                Recent Open Gigs Near You
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Here is how tasks posted by local homeowners appear to nearby workers right now.
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
                            {["All", "Plumbing", "Home Cleaning", "AC & Appliance"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCategory(tab)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                        activeCategory === tab
                                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                            : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                            {job.category}
                                        </span>
                                        <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                                            📍 {job.distance}
                                        </span>
                                    </div>

                                    <h3 className="mt-3.5 text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                                        {job.title}
                                    </h3>

                                    <div className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <span>📌 Location:</span>
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span>📅 Needed By:</span>
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.requiredDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                    <div>
                                        <div className="text-[11px] text-zinc-400 uppercase font-semibold">Payout</div>
                                        <div className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                                            {job.payout} <span className="text-xs font-normal text-zinc-500">({job.payoutType})</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/login"
                                        className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-teal-600 dark:hover:bg-teal-700"
                                    >
                                        Apply for Gig
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TRUST & VERIFICATION STANDARD (`id="trust"`) */}
            <section id="trust" className="py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl text-center mx-auto mb-14">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                            Why Local Households &amp; Workers Trust WorkNear
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            We bring corporate-grade safety, upfront accountability, and instant proximity to neighborhood service work.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-600 font-bold text-lg dark:bg-teal-950 dark:text-teal-400">
                                🔒
                            </div>
                            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                100% Background &amp; ID Verification
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Every professional on WorkNear goes through identity verification (Aadhar/Govt ID check) and local address verification before receiving their service provider badge.
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-600 font-bold text-lg dark:bg-teal-950 dark:text-teal-400">
                                📍
                            </div>
                            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Hyper-Local Proximity (&lt; 5 km)
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                No waiting around for workers coming from across the city. Our algorithm connects you only with skilled neighborhood providers who can arrive within minutes.
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-600 font-bold text-lg dark:bg-teal-950 dark:text-teal-400">
                                💰
                            </div>
                            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Zero Commission Daily Payouts
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Unlike traditional agencies that cut 20-30% from workers&apos; daily earnings, WorkNear lets professionals retain their direct wages while giving employers clear fixed rates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CALL TO ACTION FOR WORKERS & EMPLOYERS */}
            <section className="bg-zinc-900 text-white py-14 dark:bg-teal-950/60 border-t border-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Ready to hire a pro or start earning today?
                        </h2>
                        <p className="mt-1 text-sm text-zinc-300">
                            Post your emergency task right now or join thousands of verified local professionals.
                        </p>
                    </div>
                    <div className="mt-6 sm:mt-0 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/post-job"
                            className="rounded-md bg-teal-500 px-5 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-teal-400"
                        >
                            Post a Task Now
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-md border border-zinc-600 bg-transparent px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                        >
                            Become a Service Partner
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
