import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-zinc-900 text-zinc-400 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Brand & Mission */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 font-bold text-white text-sm">
                                W
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">
                                Work<span className="text-teal-400">Near</span>
                            </span>
                        </div>
                        <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-zinc-400">
                            WorkNear is the leading hyper-local service and gig network. We connect verified neighborhood skilled workers, technicians, and daily professionals with urgent community needs.
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-zinc-300">
                            <span>📍 20+ Active Cities</span>
                            <span>⚡ &lt; 5 km Average Radius</span>
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                            Popular Services
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs">
                            <li><Link href="/#categories" className="hover:text-white transition">Electrician Services</Link></li>
                            <li><Link href="/#categories" className="hover:text-white transition">Plumbing Repairs</Link></li>
                            <li><Link href="/#categories" className="hover:text-white transition">Home & Office Cleaning</Link></li>
                            <li><Link href="/#categories" className="hover:text-white transition">AC & Appliance Repair</Link></li>
                            <li><Link href="/#categories" className="hover:text-white transition">House Relocation & Shifting</Link></li>
                        </ul>
                    </div>

                    {/* For Providers */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                            For Professionals
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs">
                            <li><Link href="/register" className="hover:text-white transition">Register as Service Pro</Link></li>
                            <li><Link href="/post-job" className="hover:text-white transition">Partner Dashboard</Link></li>
                            <li><Link href="/#trust" className="hover:text-white transition">Background Verification</Link></li>
                            <li><Link href="/" className="hover:text-white transition">Proximity Matching Algorithm</Link></li>
                        </ul>
                    </div>

                    {/* Company & Support */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                            Support & Legal
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs">
                            <li><Link href="/" className="hover:text-white transition">Help Center & FAQ</Link></li>
                            <li><Link href="/" className="hover:text-white transition">Safety Guidelines</Link></li>
                            <li><Link href="/" className="hover:text-white transition">Terms of Service</Link></li>
                            <li><Link href="/" className="hover:text-white transition">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} WorkNear Technologies Inc. All rights reserved.</p>
                    <div className="mt-3 sm:mt-0 flex gap-6">
                        <span>Verified Security</span>
                        <span>Direct Proximity Payouts</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
