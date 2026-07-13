'use client';

import { useCurrency } from "@/context/CurrencyContext";

export default function PriceDisplay({ phpInCents, usdInCents }: { phpInCents: number; usdInCents: number }) {
    const { formatPrice } = useCurrency();
    return (
        <span className="text-[3.2rem] font-black text-neutral-900 tracking-tight">
            {formatPrice(phpInCents, usdInCents)}
        </span>
    );
}
