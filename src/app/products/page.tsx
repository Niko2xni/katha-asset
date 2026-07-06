import { unstable_cache } from "next/cache";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductGrid from "./ProductGrid";

interface PageProps {
    searchParams: Promise<{ tag?: string }>;
}

// Wrap the core database query in an optimized cache enclosure layer
const getCachedProducts = unstable_cache(
    async (tag?: string) => {
        return await db.product.findMany({
        where: tag ? { tags: { has: tag } } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { name: true } } },
        });
    },
    ["products-catalog-cache"], // Global cache key identifier
    { 
        revalidate: 300, // Automates background cache expiration after 5 minutes (300 seconds)
        tags: ["products"] // Dependency tag allowing instant administrative programmatic clearance
    }
);

// Cached extraction utility for product tag categories
const getCachedTags = unstable_cache(
    async () => {
        const allProductsForTags = await db.product.findMany({ select: { tags: true } });
        return Array.from(new Set(allProductsForTags.flatMap((p) => p.tags)));
    },
    ["products-tags-cache"],
    { revalidate: 3600 } // Cache structural tag taxonomies for 1 hour
);

export default async function ProductsPage({ searchParams }: PageProps) {
    // Await the search parameters per Next.js 15+ aynchronous contract rules
    const resolvedParams = await searchParams;
    const activeTag = resolvedParams.tag;

    // Read data instantly from memory or populate the cache if expired
    const products = await getCachedProducts(activeTag);
    const uniqueTags = await getCachedTags();

    return (
        <div className="w-full min-h-screen bg-neutral-50">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-[3.2rem] font-black text-neutral-900 tracking-tight mb-2">
                        Digital Asset Storefront
                    </h1>
                    <p className="text-[1.6rem] text-neutral-500">
                        Premium localized development resources curated by international professionals.
                    </p>
                </div>

                {/* Client presentation component handling state context transformations */}
                <ProductGrid products={products} uniqueTags={uniqueTags} activeTag={activeTag} />
            </main>
        </div>
    );
}