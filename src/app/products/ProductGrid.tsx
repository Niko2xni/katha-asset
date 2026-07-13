"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

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
  creator: { id: string; name: string | null };
}

interface ProductGridProps {
  products: ProductWithCreator[];
  uniqueTags: string[];
  activeTag?: string;
  page: number;
  limit: number;
  totalCount: number;
}

export default function ProductGrid({
  products,
  uniqueTags,
  activeTag,
  page,
  limit,
  totalCount,
}: ProductGridProps) {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-neutral-200">
          <Link
            href={`/products?page=${page - 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ""}`}
            className={buttonVariants({
              variant: "outline",
              className: `text-[1.3rem] h-auto px-4 py-2 cursor-pointer ${!hasPrevPage ? "pointer-events-none opacity-50" : ""}`,
            })}
            aria-disabled={!hasPrevPage}
          >
            Previous
          </Link>
          <span className="text-[1.4rem] font-medium text-neutral-600">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/products?page=${page + 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ""}`}
            className={buttonVariants({
              variant: "outline",
              className: `text-[1.3rem] h-auto px-4 py-2 cursor-pointer ${!hasNextPage ? "pointer-events-none opacity-50" : ""}`,
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
