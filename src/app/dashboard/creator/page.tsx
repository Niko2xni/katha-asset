import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import CreatorDashboardClient from "./CreatorDashboardClient";

export default async function CreatorDashboard() {
    const session = await auth();

    // Enforce access control rules at the server layer
    if (!session) redirect("/login");
    if (session.user.role !== "CREATOR") {
        redirect("/products"); // Safe fallback for non-authorized roles
    }

    // Query products owned by this creator including relational purchases
    const products = await db.product.findMany({
        where: { creatorId: session.user.id },
        include: {
            purchases: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    // Map statistics
    const myProductIds = products.map(p => p.id);
    let initialSalesCount = 0;
    let initialRevenuePhp = 0;
    let initialRevenueUsd = 0;

    const topAssets = products.map(p => {
        const sales = p.purchases.length;
        initialSalesCount += sales;
        initialRevenuePhp += sales * p.pricePhpInCents;
        initialRevenueUsd += sales * p.priceUsdInCents;

        return {
            id: p.id,
            title: p.title,
            pricePhpInCents: p.pricePhpInCents,
            priceUsdInCents: p.priceUsdInCents,
            sales: sales,
            rating: p.rating,
        };
    });

    return (
        <div className="w-full min-h-screen bg-neutral-50">
            <Navbar />
            <main className="max-w-[1200px] mx-auto px-8 py-12">
                <CreatorDashboardClient 
                    initialSalesCount={initialSalesCount}
                    initialRevenuePhp={initialRevenuePhp}
                    initialRevenueUsd={initialRevenueUsd}
                    myProductIds={myProductIds}
                    topAssets={topAssets}
                />
            </main>
        </div>
    );
}