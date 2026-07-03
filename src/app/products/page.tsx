import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductGrid from "./ProductGrid";

interface PageProps {
    searchParams: Promise<{ tag?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    // Await the search parameters per Next.js 15+ aynchronous contract rules
    const resolvedParams = await searchParams;
    const activeTag = resolvedParams.tag;

    // Query Supabase directly from the server node
    const products = await prisma.product.findMany({
        where: activeTag ? {
            tags: {
                has: activeTag
            }
        } : undefined,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            creator: {
                select: {
                    name: true,
                }
            }
        }
    });

    // Extract all distinct tags across your repository to generate filtering buttons
    const allProductsForTags = await prisma.product.findMany({ select: { tags: true } });
    const uniqueTags = Array.from(new Set(allProductsForTags.flatMap((p) => p.tags)));

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