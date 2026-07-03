import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function CreatorDashboard() {
    const session = await auth();

    // Enforce access control rules at the server layer
    if (!session) redirect("/login");
    if (session.user.role !== "CREATOR") {
        redirect("/products"); // Safe fallback for non-authorized roles
    }

    return (
        <div className="w-full min-h-screen bg-neutral-50">
            <Navbar />
            <main className="max-w-[1200px] mx-auto px-8 py-12">
                <h1 className="text-[3.2rem] font-black tracking-tight text-neutral-900">
                    Welcome Back, {session.user.name}
                </h1>
                <p className="text-[1.6rem] text-neutral-500 mt-2">
                    Role context verified: <span className="font-bold text-primary">{session.user.role}</span>
                </p>
            </main>
        </div>
    );
}