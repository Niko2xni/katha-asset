'use client';

import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";

export default function CurrencyToggle() {
    const { currency, toggleCurrency } = useCurrency();

    return (
        <Button
            onClick={toggleCurrency}
            variant="outline"
            className="text-[1.4rem] font-medium px-4 py-2 h-auto cursor-pointer transition-colors hover:bg-neutral-100"
        >
            Currency: <span className="font-bold ml-1 text-primary">{currency}</span>
        </Button>
    );
}