import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// Define the exact shape of the JSON output we require from the LLM
const localizationSchema = z.object({
    globalTitle: z.string().describe("Cleaned, globally accessible SEO title wrapper."),
    englishTranslation: z.string().describe("A full translation or clean English alternative of any localized slang terms used."),
    globalKeywords: z.array(z.string()).describe("An array of 6-8 search terms matching universal design jargon related to this asset."),
    suggestedCategories: z.array(z.string()).describe("Top 2 standard architectural categories for indexing this asset."),
});

// Explicit TS definition of the Schema output to guarantee strict fallback payload typing
type LocalizationPayload = z.infer<typeof localizationSchema>;
export async function POST(req: Request) {
    try {
        // 1. Authenticate user access context
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized Execution", { status: 401 });
        }

        // Ensure the requester possesses the required Creator clearance role boundaries
        if (session.user.role !== "CREATOR") {
            return new NextResponse("Forbidden Resource: Creator credentials mandated.", { status: 403 });
        }

        const { rawTitle, rawDescription } = await req.json();
        if (!rawTitle || !rawDescription) {
            return new NextResponse("Missing Core Input Parameters", { status: 400 });
        }

        // 2. Direct the request to the Google Gemini model loop with strict bounds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s absolute execution ceiling

        try {
            const { object } = await generateObject({
                model: google("gemini-3.1-flash-lite"),
                schema: localizationSchema,
                system: `You are an expert design asset cataloging AI specializing in cultural localization. 
                        Your job is to read localized titles and descriptions from Philippine content creators 
                        and expand them into globally understandable, search-optimized English metadata structures. 
                        Deconstruct specific cultural concepts into universal keywords.`,
                prompt: `Analyze this asset:\nTitle: "${rawTitle}"\nDescription: "${rawDescription}"`,
                abortSignal: controller.signal,
            });
            clearTimeout(timeoutId);

            // 3. Return the type-safe validated JSON directly back to the creator dashboard UI
            return NextResponse.json(object);
        } catch (aiError) {
            clearTimeout(timeoutId);
            console.warn("AI Generation Fault/Timeout. Activating Graceful Degradation Routine:", aiError);

            // Graceful Degradation: Construct typed fallback to prevent UI blocking
            const fallbackPayload: LocalizationPayload = {
                globalTitle: rawTitle,
                englishTranslation: rawDescription,
                globalKeywords: ["asset", "digital", "design", "creative", "resource"],
                suggestedCategories: ["General", "Uncategorized"]
            };

            return NextResponse.json(fallbackPayload);
        }
    } catch (error) {
        console.error("Fatal System Processing Error:", error);
        return new NextResponse("Internal LLM Processing Error", { status: 500 });
    }
}