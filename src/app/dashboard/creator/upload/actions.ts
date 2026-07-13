"use server";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import { revalidateTag } from "next/cache";

interface ProductSubmitData {
  title: string;
  description: string;
  pricePhpInCents: number;
  priceUsdInCents: number;
  previewUrl: string;
  secureFileUrl: string;
  tags: string[];
}

export async function createProduct(data: ProductSubmitData) {
  const session = await auth();
  if (!session || session.user.role !== "CREATOR") {
    throw new Error("Unauthorized execution context: Creator role mandated.");
  }

  const product = await db.product.create({
    data: {
      title: data.title,
      description: data.description,
      pricePhpInCents: data.pricePhpInCents,
      priceUsdInCents: data.priceUsdInCents,
      previewUrl: data.previewUrl,
      secureFileUrl: data.secureFileUrl,
      tags: data.tags,
      creatorId: session.user.id,
      rating: 4.5, // Seed standard initial rating value for new submissions
    },
  });

  // Invalidate the cache tags to instantly reflect changes on digital storefront
  revalidateTag("products", "default");

  return { success: true, productId: product.id };
}
