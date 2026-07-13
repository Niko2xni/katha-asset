import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import UploadFormClient from "./UploadFormClient";

export default async function CreatorUploadPage() {
  const session = await auth();

  // Secure the upload page route
  if (!session) redirect("/login");
  if (session.user.role !== "CREATOR") {
    redirect("/products");
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-[3.2rem] font-black text-neutral-900 tracking-tight">
            Upload Development Asset
          </h1>
          <p className="text-[1.6rem] text-neutral-500 mt-2">
            Add a new premium development resource. Utilize the AI assistant to
            optimize details.
          </p>
        </div>

        <UploadFormClient />
      </main>
    </div>
  );
}
