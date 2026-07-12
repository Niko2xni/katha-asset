'use client';

import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";

export default function BuyButton({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false);
    const { currency } = useCurrency();

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, currencyMode: currency }),
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
        <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full text-[1.5rem] h-auto py-4 font-bold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-lg shadow-sm"
        >
            {loading ? "Initializing Checkout..." : "Instant Purchase"}
        </Button>
    );
}
