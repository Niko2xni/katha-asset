import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KathaAsset | Digital Asset Hub",
  description:
    "An AI-Powered, Secure Digital Asset Marketplace for Philippine & International Creators.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedCurrency = cookieStore.get("katha_currency")?.value;
  const initialCurrency = storedCurrency === "USD" ? "USD" : "PHP";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CurrencyProvider initialCurrency={initialCurrency}>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
