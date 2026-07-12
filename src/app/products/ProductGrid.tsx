'use client';

import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

// Explicitly type incoming Prisma payloads including database relations joins
interface ProductWithCreator {
    id: string;
    title: string;
    description: string;
    pricePhpInCents: number;
    priceUsdInCents: number;
    previewUrl: string;
    tags: string[];
    rating: number;
    creator: { name: string | null };
}

interface ProductGridProps {
    products: ProductWithCreator[];
    uniqueTags: string[];
    activeTag?: string;
    page: number;
    limit: number;
    totalCount: number;
}

function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < fullStars) {
                    return (
                        <svg key={i} className="w-[1.4rem] h-[1.4rem] fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    );
                }
                if (i === fullStars && hasHalf) {
                    return (
                        <svg key={i} className="w-[1.4rem] h-[1.4rem] fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27V2.27v15z"/></svg>
                    );
                }
                return (
                    <svg key={i} className="w-[1.4rem] h-[1.4rem] text-neutral-300 fill-neutral-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                );
            })}
            <span className="text-[1.2rem] text-neutral-500 font-bold ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ProductGrid({ products, uniqueTags, activeTag, page, limit, totalCount }: ProductGridProps) {
    const { formatPrice, currency } = useCurrency();
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const handleCheckout = async (productId: string) => {
        try {
            setLoadingProductId(productId);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, currencyMode: currency }),
            });
            if (res.ok) {
                const data = await res.json();
                window.location.href = data.url;
            } else if (res.status === 401) {
                window.location.href = "/login";
            } else {
                alert("Failed to initialize checkout session.");
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to payment gateway.");
        } finally {
            setLoadingProductId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Category Filtering Row */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                    {/* All Assets Filter Link */}
                    <Link
                        href="/products"
                        className={buttonVariants({
                            variant: !activeTag ? "default" : "outline",
                            className: "text-[1.3rem] h-auto px-4 py-2 cursor-pointer",
                        })}
                    >
                        All Assets
                    </Link>

                    {uniqueTags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/products?tag=${encodeURIComponent(tag)}`}
                            className={buttonVariants({
                                variant: activeTag === tag ? "default" : "outline",
                                className: "text-[1.3rem] h-auto px-4 py-2 cursor-pointer",
                            })}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Grid Empty Condition */}
            {products.length === 0 && (
                <div className="w-full text-center py-20 bg-white border border-neutral-200 rounded-xl">
                    <p className="text-[1.6rem] text-neutral-400 font-medium">
                        No assets matching this category were found.
                    </p>
                </div>
            )}

            {/* Product Display Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-white border border-neutral-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div>
                            {/* Product Card Media Container */}
                            <div className="w-full h-[180px] overflow-hidden bg-neutral-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={product.previewUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[1.2rem] font-semibold tracking-wide uppercase text-neutral-400">
                                        By {product.creator.name || "Anonymous"}
                                    </span>
                                    <StarRating rating={product.rating} />
                                </div>
                                <CardTitle className="text-[2.0rem] font-bold text-neutral-900 leading-tight">
                                    {product.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="px-6 pb-4">
                                <p className="text-[1.4rem] text-neutral-600 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {product.tags.slice(0, 3).map((t) => (
                                        <span key={t} className="text-[1.1rem] bg-neutral-100 px-2 py-1 rounded text-neutral-500 font-medium">
                                        #{t}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </div>

                        <CardFooter className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                            <span className="text-[2.2rem] font-black text-neutral-900">
                                {formatPrice(product.pricePhpInCents, product.priceUsdInCents)}
                            </span>
                            <Button 
                                onClick={() => handleCheckout(product.id)}
                                disabled={loadingProductId !== null}
                                className="text-[1.3rem] h-auto px-5 py-2.5 font-bold cursor-pointer bg-neutral-900 text-white hover:bg-neutral-800"
                            >
                                {loadingProductId === product.id ? "Loading..." : "Purchase"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-neutral-200">
                    <Link
                        href={`/products?page=${page - 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
                        className={buttonVariants({
                            variant: "outline",
                            className: `text-[1.3rem] h-auto px-4 py-2 cursor-pointer ${!hasPrevPage ? 'pointer-events-none opacity-50' : ''}`,
                        })}
                        aria-disabled={!hasPrevPage}
                    >
                        Previous
                    </Link>
                    <span className="text-[1.4rem] font-medium text-neutral-600">
                        Page {page} of {totalPages}
                    </span>
                    <Link
                        href={`/products?page=${page + 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
                        className={buttonVariants({
                            variant: "outline",
                            className: `text-[1.3rem] h-auto px-4 py-2 cursor-pointer ${!hasNextPage ? 'pointer-events-none opacity-50' : ''}`,
                        })}
                        aria-disabled={!hasNextPage}
                    >
                        Next
                    </Link>
                </div>
            )}
        </div>
    );
}
