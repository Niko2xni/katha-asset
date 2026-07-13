"use client";

import Link from "next/link";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PurchaseWithProduct {
  id: string;
  createdAt: Date;
  product: {
    id: string;
    title: string;
    description: string;
    pricePhpInCents: number;
    priceUsdInCents: number;
    previewUrl: string;
    creator: {
      name: string | null;
    };
  };
}

interface CustomerDashboardClientProps {
  purchases: PurchaseWithProduct[];
  userName: string;
  userEmail: string;
}

export default function CustomerDashboardClient({
  purchases,
  userName,
  userEmail,
}: CustomerDashboardClientProps) {
  const { formatPrice } = useCurrency();
  const [selectedInvoice, setSelectedInvoice] =
    useState<PurchaseWithProduct | null>(null);
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {showSuccess && (
        <div className="bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 p-6 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[1.8rem] font-bold shadow-sm">
              ✓
            </div>
            <div>
              <h4 className="text-[1.6rem] font-extrabold tracking-tight">
                Payment Successfully Processed!
              </h4>
              <p className="text-[1.3rem] text-emerald-600 font-medium mt-0.5">
                Thank you for your purchase. Your new digital assets are ready
                for download in the vault below.
              </p>
            </div>
          </div>
        </div>
      )}

      {purchases.length === 0 ? (
        <div className="w-full text-center py-20 bg-white border border-neutral-200 rounded-xl">
          <p className="text-[1.6rem] text-neutral-400 font-medium mb-4">
            You haven&apos;t purchased any digital assets yet.
          </p>
          <Link
            href="/products"
            className="inline-flex text-[1.4rem] font-bold py-3 px-6 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Browse Digital Storefront
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {purchases.map((purchase) => (
            <Card
              key={purchase.id}
              className="overflow-hidden bg-white border border-neutral-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-full h-[160px] overflow-hidden bg-neutral-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={purchase.product.previewUrl}
                    alt={purchase.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-6">
                  <span className="text-[1.2rem] font-semibold uppercase text-neutral-400">
                    By {purchase.product.creator.name || "Anonymous Creator"}
                  </span>
                  <CardTitle className="text-[2.0rem] font-bold text-neutral-900 leading-tight">
                    {purchase.product.title}
                  </CardTitle>
                  <span className="text-[1.2rem] text-neutral-400">
                    Purchased on:{" "}
                    {new Date(purchase.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <p className="text-[1.4rem] text-neutral-600 line-clamp-2">
                    {purchase.product.description}
                  </p>
                </CardContent>
              </div>
              <CardFooter className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex flex-col gap-3">
                <div className="flex w-full items-center justify-between">
                  <span className="text-[1.4rem] font-bold text-neutral-500">
                    Paid Amount:
                  </span>
                  <span className="text-[1.8rem] font-black text-neutral-900">
                    {formatPrice(
                      purchase.product.pricePhpInCents,
                      purchase.product.priceUsdInCents,
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <a
                    href={`/api/download/${purchase.product.id}`}
                    className="inline-flex items-center justify-center text-[1.3rem] h-auto px-4 py-2.5 font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer text-center"
                  >
                    Download Asset
                  </a>
                  <Button
                    onClick={() => setSelectedInvoice(purchase)}
                    variant="outline"
                    className="text-[1.3rem] h-auto px-4 py-2.5 font-bold cursor-pointer"
                  >
                    View Invoice
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Localized Invoice Modal overlay */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] border border-neutral-200 overflow-hidden relative flex flex-col max-h-[90vh]">
            {/* Invoice Printable View */}
            <div
              className="p-12 overflow-y-auto print:p-0 flex-1 space-y-8"
              id="printable-invoice"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-neutral-100 pb-6">
                <div>
                  <h2 className="text-[2.2rem] font-extrabold tracking-tight text-neutral-900">
                    KATHA<span className="text-neutral-400">MARKET</span>
                  </h2>
                  <p className="text-[1.1rem] text-neutral-400 mt-1">
                    Digital Asset Trade Portal
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[1.2rem] font-bold bg-neutral-100 text-neutral-800 px-3 py-1 rounded">
                    OFFICIAL INVOICE
                  </span>
                  <p className="text-[1.2rem] text-neutral-500 mt-2 font-mono">
                    INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 text-[1.3rem]">
                <div>
                  <span className="text-neutral-400 font-semibold uppercase block">
                    Billed To
                  </span>
                  <span className="font-bold text-neutral-800 mt-1 block">
                    {userName}
                  </span>
                  <span className="text-neutral-500 block">{userEmail}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 font-semibold uppercase block">
                    Transaction Date
                  </span>
                  <span className="font-bold text-neutral-800 mt-1 block">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString(
                      "en-PH",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                  <span className="text-neutral-500 block">
                    Payment Method: PayMongo Gateway
                  </span>
                </div>
              </div>

              {/* Invoice Line Item Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[1.3rem]">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="p-4 font-bold text-neutral-600">
                        Product / Development Resource
                      </th>
                      <th className="p-4 font-bold text-neutral-600 text-right">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="p-4">
                        <span className="font-bold text-neutral-800 block">
                          {selectedInvoice.product.title}
                        </span>
                        <span className="text-[1.1rem] text-neutral-400 block">
                          Developed by{" "}
                          {selectedInvoice.product.creator.name || "Anonymous"}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-neutral-800">
                        {formatPrice(
                          selectedInvoice.product.pricePhpInCents,
                          selectedInvoice.product.priceUsdInCents,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Localized VAT breakdown for Philippine requirements */}
              <div className="border-t border-neutral-100 pt-6 flex flex-col items-end gap-2 text-[1.3rem]">
                <div className="flex w-full max-w-[280px] justify-between">
                  <span className="text-neutral-500">
                    Net Amount (VAT-Exempt):
                  </span>
                  <span className="text-neutral-800 font-semibold">
                    {formatPrice(
                      Math.round(
                        selectedInvoice.product.pricePhpInCents / 1.12,
                      ),
                      Math.round(
                        selectedInvoice.product.priceUsdInCents / 1.12,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex w-full max-w-[280px] justify-between">
                  <span className="text-neutral-500">
                    Value Added Tax (12%):
                  </span>
                  <span className="text-neutral-800 font-semibold">
                    {formatPrice(
                      selectedInvoice.product.pricePhpInCents -
                        Math.round(
                          selectedInvoice.product.pricePhpInCents / 1.12,
                        ),
                      selectedInvoice.product.priceUsdInCents -
                        Math.round(
                          selectedInvoice.product.priceUsdInCents / 1.12,
                        ),
                    )}
                  </span>
                </div>
                <div className="flex w-full max-w-[280px] justify-between border-t border-neutral-200 pt-3">
                  <span className="text-neutral-900 font-bold">
                    Total Settled:
                  </span>
                  <span className="text-neutral-950 font-black text-[1.6rem]">
                    {formatPrice(
                      selectedInvoice.product.pricePhpInCents,
                      selectedInvoice.product.priceUsdInCents,
                    )}
                  </span>
                </div>
              </div>

              {/* Footer note */}
              <div className="text-center text-[1.1rem] text-neutral-400 border-t border-neutral-100 pt-6">
                Thank you for your business. This receipt is automatically
                generated and acts as proof of purchase for digital development
                assets.
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3 print:hidden">
              <Button
                onClick={() => setSelectedInvoice(null)}
                variant="outline"
                className="text-[1.3rem] h-auto px-4 py-2 cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={handlePrintInvoice}
                className="text-[1.3rem] h-auto px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer font-bold"
              >
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
