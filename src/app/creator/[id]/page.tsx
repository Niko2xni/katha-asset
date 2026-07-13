import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CreatorProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch creator details
  const creator = await db.user.findUnique({
    where: { id },
  });

  // Check if the user exists and has the CREATOR role
  if (!creator || creator.role !== "CREATOR") {
    notFound();
  }

  // Fetch all products published by this creator
  const products = await db.product.findMany({
    where: { creatorId: id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      {/* Profile Header Banner */}
      <section className="bg-neutral-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950 opacity-90" />

        <div className="relative max-w-[1200px] mx-auto px-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Creator Avatar */}
          {creator.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.image}
              alt={creator.name || "Creator"}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-neutral-800 bg-neutral-800 object-cover shadow-md"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-neutral-800 border-4 border-neutral-700 text-white rounded-full flex items-center justify-center font-black text-[3.6rem] shadow-md">
              {(creator.name || "C")[0].toUpperCase()}
            </div>
          )}

          {/* Creator Details Info */}
          <div className="text-center sm:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-[3.0rem] sm:text-[3.6rem] font-black tracking-tight leading-none">
                  {creator.name || "Anonymous Creator"}
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[1.2rem] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  Verified Creator
                </span>
              </div>
              <p className="text-[1.4rem] text-neutral-400">
                Member since:{" "}
                {new Date(creator.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex items-center justify-center sm:justify-start gap-8 pt-2">
              <div>
                <span className="block text-[2.2rem] font-extrabold tracking-tight">
                  {products.length}
                </span>
                <span className="block text-[1.2rem] text-neutral-400 uppercase font-semibold tracking-wider">
                  Published Assets
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Area */}
      <main className="max-w-[1200px] w-full mx-auto px-8 py-16 flex-1">
        <div className="mb-10">
          <h2 className="text-[2.4rem] font-extrabold text-neutral-900 tracking-tight">
            Asset Catalog
          </h2>
          <p className="text-[1.5rem] text-neutral-500 mt-1">
            Browse all premium developer products published by{" "}
            {creator.name || "this creator"}.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-neutral-200 rounded-xl">
            <p className="text-[1.6rem] text-neutral-400 font-medium">
              This creator hasn&apos;t published any assets yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
