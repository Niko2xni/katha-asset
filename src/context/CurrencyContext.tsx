"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

type CurrencyMode = "PHP" | "USD";

interface CurrencyContextType {
  currency: CurrencyMode;
  toggleCurrency: () => void;
  formatPrice: (phpInCents: number, usdInCents: number) => string;
}

function persistCurrency(currency: CurrencyMode) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `katha_currency=${currency}; path=/; expires=${expires.toUTCString()}; samesite=lax`;
}

// Instantiate the formatters once globally in memory
const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({
  children,
  initialCurrency = "PHP",
}: {
  children: React.ReactNode;
  initialCurrency?: CurrencyMode;
}) {
  const [currency, setCurrency] = useState<CurrencyMode>(initialCurrency);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => {
      const nextCurrency = prev === "PHP" ? "USD" : "PHP";
      persistCurrency(nextCurrency);
      return nextCurrency;
    });
  }, []);

  const formatPrice = useCallback(
    (phpInCents: number, usdInCents: number) => {
      if (currency === "PHP") {
        return phpFormatter.format(phpInCents / 100);
      }
      return usdFormatter.format(usdInCents / 100);
    },
    [currency],
  );

  const contextValue = useMemo(
    () => ({
      currency,
      toggleCurrency,
      formatPrice,
    }),
    [currency, toggleCurrency, formatPrice],
  );

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
