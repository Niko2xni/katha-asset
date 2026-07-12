'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "./actions";
import AiAssistant from "@/components/AiAssistant";
import { Button } from "@/components/ui/button";

export default function UploadFormClient() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pricePhp, setPricePhp] = useState("");
    const [priceUsd, setPriceUsd] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [secureFileUrl, setSecureFileUrl] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleApplyAi = (data: { title: string; description: string; tags: string[] }) => {
        setTitle(data.title);
        setDescription(data.description);
        setTagsInput(data.tags.join(", "));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !pricePhp || !priceUsd || !previewUrl || !secureFileUrl) {
            alert("Please populate all fields to proceed with submission.");
            return;
        }

        try {
            setSubmitting(true);
            const phpCents = Math.round(parseFloat(pricePhp) * 100);
            const usdCents = Math.round(parseFloat(priceUsd) * 100);
            
            const tags = tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);

            const result = await createProduct({
                title,
                description,
                pricePhpInCents: phpCents,
                priceUsdInCents: usdCents,
                previewUrl,
                secureFileUrl,
                tags
            });

            if (result.success) {
                router.push("/dashboard/creator");
                router.refresh();
            } else {
                alert("Database creation failure.");
            }
        } catch (err) {
            console.error(err);
            alert("Error registering the product resource.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div className="border-b border-neutral-100 pb-4">
                    <h2 className="text-[2.0rem] font-bold text-neutral-900">Resource Registration</h2>
                    <p className="text-[1.3rem] text-neutral-500">Provide official details to register this digital asset on KathaMarket.</p>
                </div>

                <div className="space-y-4 text-[1.3rem]">
                    <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block">Asset Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Modern Filipino Bamboo Cabin 3D Asset"
                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block">Asset Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Provide a detailed outline of this development resource..."
                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-neutral-500 font-bold block">Price (PHP)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={pricePhp}
                                onChange={(e) => setPricePhp(e.target.value)}
                                placeholder="e.g. 1500.00"
                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-neutral-500 font-bold block">Price (USD)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={priceUsd}
                                onChange={(e) => setPriceUsd(e.target.value)}
                                placeholder="e.g. 29.99"
                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block">Preview Image URL (Thumbnail)</label>
                        <input
                            type="url"
                            value={previewUrl}
                            onChange={(e) => setPreviewUrl(e.target.value)}
                            placeholder="https://example.com/thumbnail.jpg"
                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block">Secure Storage File Path (Cloud Bucket Folder)</label>
                        <input
                            type="text"
                            value={secureFileUrl}
                            onChange={(e) => setSecureFileUrl(e.target.value)}
                            placeholder="e.g. cabins/modern_bamboo_cabin.zip"
                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block">Tags / Categories (Comma Separated)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. architecture, 3d-model, bamboo"
                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-neutral-100">
                    <Button
                        type="button"
                        onClick={() => router.push("/dashboard/creator")}
                        variant="outline"
                        className="w-1/3 text-[1.4rem] font-bold py-3 h-auto cursor-pointer"
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="w-2/3 bg-neutral-900 text-white hover:bg-neutral-800 text-[1.4rem] font-bold py-3 h-auto cursor-pointer"
                        disabled={submitting}
                    >
                        {submitting ? "Publishing resource..." : "Publish Digital Resource"}
                    </Button>
                </div>
            </form>

            {/* AI Assistant Section */}
            <div className="lg:col-span-5">
                <AiAssistant onApply={handleApplyAi} />
            </div>
        </div>
    );
}
