import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const rawBody = await req.text(); // Extracts raw buffer stream to ensure validation accuracy
        const signatureHeader = req.headers.get("paymongo-signature");

        if (!signatureHeader || !process.env.PAYMONGO_WEBHOOK_SECRET) {
            return new NextResponse("Security Verification Context Deficit", { status: 400 });
        }

        // Parse paymongo-signature string components (Format: t=12345,te=abcde,li=fghij)
        const signatureMap: Record<string, string> = {};
        signatureHeader.split(",").forEach((pair) => {
            const [key, value] = pair.split("=");
            if (key && value) signatureMap[key.trim()] = value.trim();
        });

        const timestamp = signatureMap["t"];
        const testSignature = signatureMap["te"]; // Use 'te' for testmode verification metrics

        if (!timestamp || !testSignature) {
            return new NextResponse("Malformed Signature Envelope Structure", { status: 400 });
        }

        // Reconstruct token challenge mapping string target
        const signaturePayload = `${timestamp}.${rawBody}`;
        const calculatedSignature = crypto
            .createHmac("sha256", process.env.PAYMONGO_WEBHOOK_SECRET)
            .update(signaturePayload)
            .digest("hex");

        const calculatedBuffer = Buffer.from(calculatedSignature, "utf-8");
        const testBuffer = Buffer.from(testSignature, "utf-8");

        if (calculatedBuffer.length !== testBuffer.length) {
            return new NextResponse("Cryptographic Validation Integrity Discrepancy", { status: 401 });
        }

        // Constant-time execution check blocks side-channel timing attack exploits
        const isValid = crypto.timingSafeEqual(calculatedBuffer, testBuffer);

        if (!isValid) {
            return new NextResponse("Cryptographic Validation Integrity Discrepancy", { status: 401 });
        }

        const eventJson = JSON.parse(rawBody);
        const eventType = eventJson.data.attributes.type;

        // Listen strictly for the checkout session completion callback
        if (eventType === "checkout_session.payment.paid") {
            // PayMongo deeply nests session configurations within attributes.data
            const sessionData = eventJson.data.attributes.data;
            const sessionId = sessionData.id;
            const metadata = sessionData.attributes.metadata;

            if (!metadata) {
                return new NextResponse("Target Session Metadata Context Absent", { status: 400 });
            }

            const { userId, productId } = metadata;

            const existingOrder = await db.order.findUnique({
                where: { paymongoSessionId: sessionId },
            });

            if (existingOrder && existingOrder.status === "PAID") {
                return new NextResponse("Event Already Reconciled (Idempotent Intercepted)", { status: 200 });
            }

            // Execute transaction mapping steps atomically together
            await db.$transaction([
                db.order.update({
                where: { paymongoSessionId: sessionId },
                data: { status: "PAID" },
                }),
                db.purchase.create({
                data: {
                    userId: userId,
                    productId: productId,
                },
                }),
            ]);
        }

        return new NextResponse("PayMongo Hook Reconciled Successfully", { status: 200 });
    } catch (error) {
        console.error("PayMongo Webhook Processing Defect:", error);
        return new NextResponse("Internal Server Error Processing Callback", { status: 500 });
    }
}