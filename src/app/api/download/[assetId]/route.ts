import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface RouteParams {
    params: Promise<{ assetId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        // 1. Enforce active authentication gate
        // const session = await auth();

        const session = {
            user: {
                id: "20f35e08-8a5e-44ea-a221-dddc17550f29", // Forces the backend to see you as this user for testing purposes
                role: "CUSTOMER" 
            }
        };
        
        if (!session?.user) {
            return new NextResponse("Unauthorized Download Attempt denied.", { status: 401 });
        }

        // Await the asynchronous route parameters context container
        const { assetId } = await params;

        // 2. Query product ledger matrix to verify resource existence
        const product = await db.product.findUnique({
            where: { id: assetId },
        });

        if (!product) {
            return new NextResponse("Target asset resource does not exist.", { status: 404 });
        }

        // 3. Evaluate purchase verification ledger to confirm payment rights
        const userOwnsAsset = await db.purchase.findUnique({
            where: {
                userId_productId: {
                userId: session.user.id,
                productId: assetId,
                },
            },
        });

        // Security Gate: Deny if customer has not cleared checkout constraints
        if (!userOwnsAsset) {
            return new NextResponse("Access Denied: Missing verified payment authorization row.", { status: 403 });
        }

        // 4. Interface with private cloud container to issue temporary presigned download link
        const { data, error } = await supabaseAdmin.storage
            .from("premium-assets")
            .createSignedUrl(product.secureFileUrl, 60, {
                download: true, // Forces browser file stream to download directly instead of rendering
            });

        if (error || !data?.signedUrl) {
            console.error("Supabase Storage Signing Exception Error:", error);
            return new NextResponse("External storage cluster link assembly failed.", { status: 500 });
        }

        // 5. Safely redirect the authorized client directly to their secure file link
        return NextResponse.redirect(data.signedUrl);
    }   catch (error) {
        console.error("Secure Asset Download Delivery System Fault:", error);
        return new NextResponse("Internal Server Error during distribution routine.", { status: 500 });
    }
}