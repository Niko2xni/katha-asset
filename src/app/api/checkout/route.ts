import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized Execution Attempt", { status: 401 });
        }

        const { productId, currencyMode } = await req.json();
        if (!productId || !currencyMode) {
            return new NextResponse("Missing Core Parameters", { status: 400 });
        }

        const product = await db.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return new NextResponse("Target Resource Not Found", { status: 404 });
        }

        const isPhp = currencyMode === "PHP";
        const targetPrice = isPhp ? product.pricePhpInCents : product.priceUsdInCents;
        const targetCurrencyCode = isPhp ? "PHP" : "USD";

        // Standard PayMongo HTTP Basic Auth encryption matrix
        const basicAuthToken = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString("base64");

        // Construct PayMongo V2 payload schema configuration
        const paymongoPayload = {
            data: {
                attributes: {
                    line_items: [
                        {
                        name: product.title,
                        description: product.description,
                        amount: targetPrice, // Expects clean integer subunits (cents/centavos)
                        currency: targetCurrencyCode,
                        quantity: 1,
                        },
                    ],
                    payment_method_types: ["gcash", "maya", "card", "qrph"],
                    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer?success=true`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
                    metadata: {
                        userId: session.user.id,
                        productId: product.id,
                    },
                },
            },
        };

        const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Basic ${basicAuthToken}`,
            },
            body: JSON.stringify(paymongoPayload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("PayMongo Session Creation Error:", responseData);
            return new NextResponse("External Provider Rejection Exception", { status: 500 });
        }

        const checkoutSessionId = responseData.data.id;
        const redirectUrl = responseData.data.attributes.checkout_url;

        // Track state initialized cleanly under PENDING constraints
        await db.order.create({
            data: {
                userId: session.user.id,
                paymongoSessionId: checkoutSessionId, // Maps local identifiers cleanly across historical patterns
                amountPhpInCents: product.pricePhpInCents,
                amountUsdInCents: product.priceUsdInCents,
                status: "PENDING",
            },
        });

        return NextResponse.json({ url: redirectUrl });
    } catch (error) {
        console.error("PayMongo Checkout Pipeline Fault:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}