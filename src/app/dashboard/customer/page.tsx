import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import CustomerDashboardClient from "./CustomerDashboardClient";

export default async function CustomerDashboard() {
  const session = await auth();

  // Secure the page to only authenticated users
  if (!session) redirect("/login");

  // Fetch the customer's purchase history from the db ledger
  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          description: true,
          pricePhpInCents: true,
          priceUsdInCents: true,
          previewUrl: true,
          creator: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full min-h-screen bg-neutral-50 print:bg-white">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-12 print:p-0">
        <div className="mb-10 print:hidden">
          <h1 className="text-[3.2rem] font-black text-neutral-900 tracking-tight">
            Customer Asset Vault
          </h1>
          <p className="text-[1.6rem] text-neutral-500 mt-2">
            View purchase history, download premium invoices, and access
            developer assets.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-[1.6rem] text-neutral-400 font-medium">
              Loading Vault...
            </div>
          }
        >
          <CustomerDashboardClient
            purchases={purchases}
            userName={session.user.name || "Valued Customer"}
            userEmail={session.user.email!}
          />
        </Suspense>
      </main>
    </div>
  );
}
