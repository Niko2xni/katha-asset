import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import BuyButton from "./BuyButton";
import PriceDisplay from "./PriceDisplay";

interface PageProps {
    params: Promise<{ id: string }>;
}

function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < fullStars) {
                    return (
                        <svg key={i} className="w-6 h-6 fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    );
                }
                if (i === fullStars && hasHalf) {
                    return (
                        <svg key={i} className="w-6 h-6 fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27V2.27v15z"/></svg>
                    );
                }
                return (
                    <svg key={i} className="w-6 h-6 text-neutral-300 fill-neutral-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                );
            })}
            <span className="text-[1.4rem] text-neutral-500 font-bold ml-2">{rating.toFixed(1)} / 5.0</span>
        </div>
    );
}

export default async function ProductDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const product = await db.product.findUnique({
        where: { id },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="w-full min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />

            <main className="max-w-[1200px] w-full mx-auto px-8 py-12 flex-1 space-y-8">
                {/* Back Link */}
                <div>
                    <Link 
                        href="/products" 
                        className="inline-flex items-center text-[1.4rem] font-bold text-neutral-500 hover:text-neutral-900 gap-1"
                    >
                        <svg className="w-[1.6rem] h-[1.6rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        Back to Products
                    </Link>
                </div>

                {/* Details Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Media Container */}
                    <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="w-full aspect-video bg-neutral-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={product.previewUrl} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Metadata & Actions Container */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            {/* Tags and Rating */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span key={tag} className="text-[1.2rem] bg-neutral-200/60 px-3 py-1 rounded-md text-neutral-600 font-semibold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <StarRating rating={product.rating} />
                            </div>

                            {/* Title */}
                            <h1 className="text-[3.2rem] sm:text-[4.0rem] font-black text-neutral-900 tracking-tight leading-tight">
                                {product.title}
                            </h1>

                            {/* Creator attribution */}
                            <div className="flex items-center gap-3 pt-2">
                                {product.creator.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={product.creator.image} 
                                        alt={product.creator.name || "Creator"} 
                                        className="w-10 h-10 rounded-full border border-neutral-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center font-bold text-[1.4rem]">
                                        {(product.creator.name || "A")[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <span className="text-[1.2rem] text-neutral-400 block font-semibold uppercase tracking-wider">Creator</span>
                                    <Link 
                                        href={`/creator/${product.creator.id}`}
                                        className="text-[1.4rem] font-bold text-neutral-900 hover:underline"
                                    >
                                        {product.creator.name || "Anonymous Creator"}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-neutral-200" />

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-[1.6rem] font-extrabold text-neutral-900">Description</h3>
                            <p className="text-[1.4rem] text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        {/* Purchase Options Card */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm space-y-6">
                            <div className="flex flex-col">
                                <span className="text-[1.2rem] text-neutral-400 font-bold uppercase tracking-wider mb-1">Price</span>
                                <PriceDisplay phpInCents={product.pricePhpInCents} usdInCents={product.priceUsdInCents} />
                            </div>

                            <BuyButton productId={product.id} />

                            {/* Reassurances */}
                            <div className="space-y-3 text-[1.2rem] text-neutral-500 border-t border-neutral-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    <span>Verified Secure Download (Supabase Storage)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    <span>Processed with PayMongo gateway (GCash, Maya, Cards, QRph)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
