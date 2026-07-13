"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    pricePhpInCents: number;
    priceUsdInCents: number;
    previewUrl: string;
    tags: string[];
    rating: number;
    creator: {
      id: string;
      name: string | null;
    };
  };
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return (
            <svg
              key={i}
              className="w-[1.4rem] h-[1.4rem] fill-amber-400 text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        }
        if (i === fullStars && hasHalf) {
          return (
            <svg
              key={i}
              className="w-[1.4rem] h-[1.4rem] fill-amber-400 text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27V2.27v15z" />
            </svg>
          );
        }
        return (
          <svg
            key={i}
            className="w-[1.4rem] h-[1.4rem] text-neutral-300 fill-neutral-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
      <span className="text-[1.2rem] text-neutral-500 font-bold ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, currency } = useCurrency();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, currencyMode: currency }),
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
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-white border border-neutral-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block flex-1 group">
        {/* Product Card Media Container */}
        <div className="w-full h-[180px] overflow-hidden bg-neutral-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.previewUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardHeader className="p-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[1.2rem] font-semibold tracking-wide uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
              {/* Prevent card click link bubbling */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Link href={`/creator/${product.creator.id}`}>
                  By {product.creator.name || "Anonymous"}
                </Link>
              </span>
            </span>
            <StarRating rating={product.rating} />
          </div>
          <CardTitle className="text-[2.0rem] font-bold text-neutral-900 leading-tight group-hover:text-neutral-700 transition-colors">
            {product.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          <p className="text-[1.4rem] text-neutral-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[1.1rem] bg-neutral-100 px-2 py-1 rounded text-neutral-500 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
        <span className="text-[2.2rem] font-black text-neutral-900">
          {formatPrice(product.pricePhpInCents, product.priceUsdInCents)}
        </span>
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="text-[1.3rem] h-auto px-5 py-2.5 font-bold cursor-pointer bg-neutral-900 text-white hover:bg-neutral-800"
        >
          {loading ? "Loading..." : "Purchase"}
        </Button>
      </CardFooter>
    </Card>
  );
}
