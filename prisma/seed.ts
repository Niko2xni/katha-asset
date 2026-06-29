import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";

// Initialize Prisma Client to talk to your Supabase database
const prisma = new PrismaClient();

async function main() {
    console.log("Clearing old data...");

    // Delete existing data in reverse order of dependencies to avoid foreign key errors
    await prisma.purchase.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log("Generating mock users and products...");

    // Create 5 Creators, each with 3 distinct digital products
    for (let i = 0; i < 5; i++) {
        await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                name: faker.person.fullName(),
                role: Role.CREATOR,
                image: faker.image.avatar(),
                products: {
                    create: Array.from({ length: 3}).map(() => {
                        // Generate standard item pricing
                        const basePhpPrice = faker.number.int({ min: 250, max: 2500 }); // e.g., PHP 500
                        const baseUsdPrice = Math.round(basePhpPrice / 58); // Simple mock conversion rate

                        return {
                            title: faker.commerce.productName(),
                            description: faker.commerce.productDescription(),
                            // Crucial: Multiply by 100 to convert standard currency amounts to clean integers (cents)
                            pricePhpInCents: basePhpPrice * 100,
                            priceUsdInCents: baseUsdPrice * 100,
                            previewUrl: faker.image.urlLoremFlickr({ category: "abstract", width: 640, height: 480 }),
                            secureFileUrl: `raw-assets/${faker.string.uuid()}.zip`,
                            tags: [faker.commerce.productAdjective(), "DigitalAsset", "PHCreator"],
                        };
                    }),
                },
            },
        });
    }

    // Create 3 standard Customers who haven't bought anything yet
    for (let i = 0; i < 3; i++) {
        await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                name: faker.person.fullName(),
                role: Role.CUSTOMER,
                image: faker.image.avatar(),
            },
        });
    }

    console.log("Database seeding complete...");
}

main().catch((e) => {
    console.error("Error during seeding: ", e);
    process.exit(1);
})
.finally(async () => {
    // Close the database connection when finished
    await prisma.$disconnect();
});