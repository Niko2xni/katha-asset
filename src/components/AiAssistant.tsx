"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LocalizationResult {
  globalTitle: string;
  englishTranslation: string;
  globalKeywords: string[];
  suggestedCategories: string[];
}

interface AiAssistantProps {
  onApply: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => void;
}

export default function AiAssistant({ onApply }: AiAssistantProps) {
  const [rawTitle, setRawTitle] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocalizationResult | null>(null);

  const handleRefine = async () => {
    if (!rawTitle.trim() || !rawDescription.trim()) {
      alert("Please input both a title and description for AI refinement.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawTitle, rawDescription }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert(
          "AI processing failed. Please verify credentials or attempt again.",
        );
      }
    } catch (e) {
      console.error(e);
      alert("Connection error connecting to AI localization server.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;

    // Merge keywords and categories into tags array
    const allTags = Array.from(
      new Set([...result.globalKeywords, ...result.suggestedCategories]),
    );

    onApply({
      title: result.globalTitle,
      description: result.englishTranslation,
      tags: allTags,
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 text-white rounded-xl p-8 space-y-6 shadow-lg h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h3 className="text-[1.8rem] font-bold flex items-center gap-2">
            <span className="text-emerald-400">✦</span> AI Storefront Assistant
          </h3>
          <p className="text-[1.2rem] text-neutral-400 mt-1">
            Translate Filipino design terms and optimize keywords for
            international storefront search algorithms.
          </p>
        </div>

        <div className="space-y-4 text-[1.3rem]">
          <div className="space-y-1">
            <label className="text-neutral-400 font-bold block">
              Raw Localized Title
            </label>
            <input
              type="text"
              value={rawTitle}
              onChange={(e) => setRawTitle(e.target.value)}
              placeholder="e.g. Makabagong Bahay Kubo 3D model"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-400 font-bold block">
              Raw Localized Description
            </label>
            <textarea
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Gawa sa kawayan at nipa, may modernong interior at rendering scenes para sa Blender..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
            />
          </div>

          <Button
            onClick={handleRefine}
            disabled={loading}
            className="w-full bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-bold text-[1.3rem] py-2.5 h-auto cursor-pointer"
          >
            {loading
              ? "Optimizing Metadata..."
              : "✦ Refine & Optimize Metadata"}
          </Button>
        </div>

        {/* AI Result Container */}
        {result && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4 text-[1.3rem] animate-in fade-in duration-300">
            <div>
              <span className="text-[1.1rem] font-bold text-emerald-400 uppercase tracking-wider block">
                SEO Optimized Title
              </span>
              <p className="font-bold text-neutral-100 mt-0.5">
                {result.globalTitle}
              </p>
            </div>
            <div>
              <span className="text-[1.1rem] font-bold text-emerald-400 uppercase tracking-wider block">
                English Translation & Expand
              </span>
              <p className="text-neutral-300 mt-0.5 leading-relaxed">
                {result.englishTranslation}
              </p>
            </div>
            <div>
              <span className="text-[1.1rem] font-bold text-emerald-400 uppercase tracking-wider block">
                Generated Jargon Jumps / Tags
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {result.globalKeywords.map((k) => (
                  <span
                    key={k}
                    className="text-[1.1rem] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono"
                  >
                    #{k}
                  </span>
                ))}
                {result.suggestedCategories.map((c) => (
                  <span
                    key={c}
                    className="text-[1.1rem] bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded font-mono"
                  >
                    #{c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <Button
          onClick={handleApply}
          className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-[1.3rem] py-3 h-auto cursor-pointer transition-colors mt-4"
        >
          Apply Suggestions to Upload Form
        </Button>
      )}
    </div>
  );
}
