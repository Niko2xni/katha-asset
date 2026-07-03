import Link from "next/link";
import CurrencyToggle from "./CurrencyToggle";

export default function Navbar() {
    return (
        <header className="w-full border-b border-neutral-200 bg-white sticky top-0 z-50 px-8 py-4">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <Link href="/products" className="text-[2.2rem] font-extrabold tracking-tight text-neutral-900 hover:opacity-90">
                    Katha<span className="text-neutral-500">Market</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/products" className="text-[1.5rem] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                        Browse Assets
                    </Link>
                    <CurrencyToggle />
                </nav>
            </div>
        </header>
    );
}