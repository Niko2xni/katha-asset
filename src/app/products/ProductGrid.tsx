'use client';

import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Explicitly type incoming Prisma payloads including database relations joins
interface ProductWithCreator {
    id: string;
    title: string;
    description: string;
    pricePhpInCents: number;
    priceUsdInCents: number;
    previewUrl: string;
    tags: string[];
    creator: { name: string | null };
}

interface ProductGridProps {
    products: ProductWithCreator[];
    uniqueTags: string[];
    activeTag?: string;
}

export default function ProductGrid({ products, uniqueTags, activeTag }: ProductGridProps) {
    const { formatPrice } = useCurrency();

    return (
        <div className="space-y-8">
            {/* Category Filtering Row */}
            <div className="flex flex-wrap gap-3 items-center">
                <Button
                    asChild
                    variant={!activeTag ? "default" : "outline"}
                    className="text-[1.3rem] h-auto px-4 py-2 cursor-pointer"
                >
                    <Link href="/products">All Assets</Link>
                </Button>

                {uniqueTags.map((tag) => (
                    <Button
                        key={tag}
                        asChild
                        variant={activeTag === tag ? "default" : "outline"}
                        className="text-[1.3rem] h-auto px-4 py-2 cursor-pointer"
                    >
                        <Link href={`/products?tag=${encodeURIComponent(tag)}`}>
                            {tag}
                        </Link>
                    </Button>
                ))}
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
                    <Card key={product.id} className="overflow-hidden bg-white border border-neutral-200 flex flex-col justify-between shadow-sm">
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
                            <Button className="text-[1.3rem] h-auto px-5 py-2.5 font-bold cursor-pointer">
                                View Asset
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
