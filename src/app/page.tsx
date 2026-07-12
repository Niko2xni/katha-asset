import Link from "next/link";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
    // Fetch top 3 rated products as featured assets
    const featuredProducts = await db.product.findMany({
        take: 3,
        orderBy: {
            rating: 'desc',
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return (
        <div className="w-full min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-neutral-950 text-white py-24 sm:py-32">
                {/* Visual Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950 opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                
                <div className="relative max-w-[1200px] mx-auto px-8 flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-3 py-1 text-[1.2rem] font-semibold text-neutral-300 ring-1 ring-inset ring-neutral-700/50 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Next-Gen Digital Asset Portal
                    </span>

                    <h1 className="text-[3.6rem] sm:text-[5.4rem] font-black tracking-tight max-w-[800px] leading-[1.1] mb-6">
                        Discover Premium <span className="bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-100 bg-clip-text text-transparent">Digital Assets</span> for Developers
                    </h1>
                    
                    <p className="text-[1.6rem] sm:text-[1.8rem] text-neutral-400 max-w-[640px] mb-10 leading-relaxed">
                        Access top-tier production-ready boilerplate, custom components, design templates, and packages crafted by industry experts.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/products"
                            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-[1.4rem] font-bold text-neutral-950 transition-colors hover:bg-neutral-200 shadow-sm"
                        >
                            Explore Catalog
                        </Link>
                        <Link
                            href="/dashboard/creator"
                            className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 px-8 text-[1.4rem] font-bold text-white transition-colors hover:bg-neutral-800 shadow-sm"
                        >
                            Become a Creator
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Assets Grid Section */}
            <section className="max-w-[1200px] w-full mx-auto px-8 py-20 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
                    <div>
                        <h2 className="text-[2.6rem] font-extrabold text-neutral-900 tracking-tight">
                            Featured Resources
                        </h2>
                        <p className="text-[1.5rem] text-neutral-500 mt-1">
                            Curated and highly-rated components and boilerplates.
                        </p>
                    </div>
                    <Link 
                        href="/products" 
                        className="text-[1.4rem] font-bold text-neutral-900 hover:underline mt-4 sm:mt-0 flex items-center gap-1.5"
                    >
                        View all assets
                        <svg className="w-[1.4rem] h-[1.4rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                {featuredProducts.length === 0 ? (
                    <div className="w-full text-center py-20 bg-white border border-neutral-200 rounded-xl">
                        <p className="text-[1.6rem] text-neutral-400 font-medium">
                            No digital assets published yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Value Proposition Grid Section */}
            <section className="bg-neutral-100/50 border-t border-b border-neutral-200/50 py-20">
                <div className="max-w-[1200px] mx-auto px-8">
                    <h2 className="text-[2.4rem] font-extrabold text-neutral-900 text-center tracking-tight mb-12">
                        Engineered for High-Performance Teams
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                            <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center">
                                <svg className="w-[2.2rem] h-[2.2rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-[1.8rem] font-bold text-neutral-900">Instant Access</h3>
                            <p className="text-[1.4rem] text-neutral-600 leading-relaxed">
                                Get immediate access to secure, private downloads inside your asset vault immediately after checking out through Paymongo.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                            <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center">
                                <svg className="w-[2.2rem] h-[2.2rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-[1.8rem] font-bold text-neutral-900">Secure Deliveries</h3>
                            <p className="text-[1.4rem] text-neutral-600 leading-relaxed">
                                Our platform integrates with Supabase Secure Storage buckets to ensure asset binaries are only decrypted and delivered to verified purchasers.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                            <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center">
                                <svg className="w-[2.2rem] h-[2.2rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <h3 className="text-[1.8rem] font-bold text-neutral-900">AI-Optimized Details</h3>
                            <p className="text-[1.4rem] text-neutral-600 leading-relaxed">
                                Creators leverage our specialized AI integration layers to optimize listing copywriting and structure clear technical descriptions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-200 bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[1.8rem] font-extrabold tracking-tight text-neutral-950">
                        Katha<span className="text-neutral-500">Market</span>
                    </div>
                    <p className="text-[1.3rem] text-neutral-400">
                        © {new Date().getFullYear()} KathaMarket. All rights reserved. Premium digital commerce portal.
                    </p>
                </div>
            </footer>
        </div>
    );
}
