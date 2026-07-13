"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetSaleInfo {
  id: string;
  title: string;
  pricePhpInCents: number;
  priceUsdInCents: number;
  sales: number;
  rating: number;
}

interface CreatorDashboardClientProps {
  initialSalesCount: number;
  initialRevenuePhp: number;
  initialRevenueUsd: number;
  myProductIds: string[];
  topAssets: AssetSaleInfo[];
}

interface ToastNotification {
  id: string;
  message: string;
  title: string;
}

export default function CreatorDashboardClient({
  initialSalesCount,
  initialRevenuePhp,
  initialRevenueUsd,
  myProductIds,
  topAssets,
}: CreatorDashboardClientProps) {
  const { formatPrice } = useCurrency();
  const [salesCount, setSalesCount] = useState(initialSalesCount);
  const [revenuePhp, setRevenuePhp] = useState(initialRevenuePhp);
  const [revenueUsd, setRevenueUsd] = useState(initialRevenueUsd);
  const [assets, setAssets] = useState<AssetSaleInfo[]>(topAssets);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Handle Realtime Purchase Events
  useEffect(() => {
    const channel = supabase
      .channel("creator-purchase-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Purchase" },
        (payload) => {
          const newPurchase = payload.new as { productId: string; id: string };

          // Verify if the purchased asset belongs to this creator
          if (myProductIds.includes(newPurchase.productId)) {
            // Find product data from assets list to calculate increments
            const targetAsset = assets.find(
              (a) => a.id === newPurchase.productId,
            );
            const incrementPhp = targetAsset ? targetAsset.pricePhpInCents : 0;
            const incrementUsd = targetAsset ? targetAsset.priceUsdInCents : 0;
            const title = targetAsset
              ? targetAsset.title
              : "Your Digital Asset";

            // Update dynamic dashboard state metrics
            setSalesCount((prev) => prev + 1);
            setRevenuePhp((prev) => prev + incrementPhp);
            setRevenueUsd((prev) => prev + incrementUsd);

            // Increment product individual sales metric
            setAssets((prev) =>
              prev.map((a) =>
                a.id === newPurchase.productId
                  ? { ...a, sales: a.sales + 1 }
                  : a,
              ),
            );

            // Trigger dynamic visual toast notification alert
            const toastId = Math.random().toString(36).substring(2, 9);
            const newToast: ToastNotification = {
              id: toastId,
              title: "New Purchase Received!",
              message: `Someone just bought your asset: "${title}"`,
            };

            setToasts((prev) => [...prev, newToast]);

            // Automatically dismiss after 5 seconds
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== toastId));
            }, 5000);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myProductIds, assets]);

  // Calculate maximum sales to scale SVG chart properly
  const maxSales = Math.max(...assets.map((a) => a.sales), 1);

  return (
    <div className="space-y-10 relative">
      {/* Live custom toast notifications window container */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 max-w-[360px] w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-neutral-900 border border-neutral-800 text-white p-5 rounded-xl shadow-2xl flex flex-col gap-1 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <h4 className="text-[1.3rem] font-black tracking-wide uppercase text-emerald-400">
                {toast.title}
              </h4>
            </div>
            <p className="text-[1.3rem] text-neutral-300 font-medium">
              {toast.message}
            </p>
          </div>
        ))}
      </div>

      {/* Header section with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[3.2rem] font-black tracking-tight text-neutral-900">
            Creator Workspace
          </h1>
          <p className="text-[1.6rem] text-neutral-500">
            Manage your assets, track real-time analytics, and expand your
            catalog.
          </p>
        </div>
        <Link
          href="/dashboard/creator/upload"
          className="inline-flex items-center justify-center text-[1.4rem] font-bold py-3 px-6 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-sm text-center"
        >
          + Upload New Asset
        </Link>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2">
            <span className="text-[1.2rem] uppercase font-bold tracking-wider text-neutral-400">
              Total Sales
            </span>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-[3.6rem] font-black text-neutral-900 tracking-tight">
              {salesCount}
            </CardTitle>
            <p className="text-[1.2rem] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Listening for live orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-neutral-200 shadow-sm">
          <CardHeader className="pb-2">
            <span className="text-[1.2rem] uppercase font-bold tracking-wider text-neutral-400">
              Revenue (PHP)
            </span>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-[3.6rem] font-black text-neutral-900 tracking-tight">
              {formatPrice(revenuePhp, 0)}
            </CardTitle>
            <p className="text-[1.2rem] text-neutral-400 mt-1">
              Calculated in Philippine Pesos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-neutral-200 shadow-sm">
          <CardHeader className="pb-2">
            <span className="text-[1.2rem] uppercase font-bold tracking-wider text-neutral-400">
              Revenue (USD)
            </span>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-[3.6rem] font-black text-neutral-900 tracking-tight">
              {formatPrice(0, revenueUsd)}
            </CardTitle>
            <p className="text-[1.2rem] text-neutral-400 mt-1">
              Calculated in US Dollars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Product Grid Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* SVG Performance Chart Block */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[1.8rem] font-bold text-neutral-900 mb-2">
              Sales Analytics
            </h3>
            <p className="text-[1.3rem] text-neutral-400 mb-8">
              Visual breakdown of total sales metrics per published resource
              asset.
            </p>
          </div>

          {assets.length === 0 ? (
            <div className="w-full text-center py-12 text-neutral-400 text-[1.4rem]">
              No published assets found.
            </div>
          ) : (
            <div className="space-y-6">
              {assets.map((asset) => {
                const percentage = (asset.sales / maxSales) * 100;
                return (
                  <div key={asset.id} className="space-y-2">
                    <div className="flex justify-between items-center text-[1.3rem]">
                      <span className="font-bold text-neutral-700 truncate max-w-[280px]">
                        {asset.title}
                      </span>
                      <span className="font-semibold text-neutral-500 font-mono">
                        {asset.sales} Sales (
                        {formatPrice(
                          asset.sales * asset.pricePhpInCents,
                          asset.sales * asset.priceUsdInCents,
                        )}
                        )
                      </span>
                    </div>
                    {/* Chart Bar */}
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Management Panel Table */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-[1.8rem] font-bold text-neutral-900 mb-2">
            Product Management Panel
          </h3>
          <p className="text-[1.3rem] text-neutral-400 mb-6">
            Active resource index mapping rates, pricing metrics, and overall
            reviews.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[1.3rem]">
              <thead>
                <tr className="border-b border-neutral-200 pb-4 text-neutral-400 font-bold">
                  <th className="pb-3 pr-4 font-semibold">Asset Title</th>
                  <th className="pb-3 pr-4 font-semibold">Rating</th>
                  <th className="pb-3 pr-4 font-semibold text-right">
                    Price (PHP)
                  </th>
                  <th className="pb-3 text-right font-semibold">Price (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assets.map((asset) => (
                  <tr key={asset.id} className="text-neutral-700">
                    <td className="py-3 pr-4 font-bold max-w-[180px] truncate">
                      {asset.title}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-[1.2rem] h-[1.2rem] fill-amber-400 text-amber-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="font-mono font-bold text-neutral-600">
                          {asset.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono font-bold">
                      {formatPrice(asset.pricePhpInCents, 0)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      {formatPrice(0, asset.priceUsdInCents)}
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-neutral-400 font-medium"
                    >
                      No assets published yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
