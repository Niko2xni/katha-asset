⚠️ **Disclaimer:** This project is currently under active development.

# Katha Asset

Katha Asset is a digital asset storefront built with Next.js, Prisma, and NextAuth. It supports product browsing, creator access, authentication, and database-backed purchase and order tracking.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A PostgreSQL database
- A `.env` file with at least `DIRECT_URL`
- OAuth credentials for the configured sign-in providers if you want authentication to work end to end

## Installation

```bash
npm install
```

If you are setting up the database for the first time, run the Prisma migration and seed commands after installation:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Run Locally

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Common Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Notes

- The homepage currently displays a simple database-backed user list.
- Product browsing lives under /products.
- Creator-only dashboard access is available under /dashboard/creator.

## License

No license file is currently included in this repository. Treat the project as all rights reserved until a license is added.
