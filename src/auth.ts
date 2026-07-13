import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import db from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" }, // Enforces stateless encrypted JWT sessions
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Runs only on initial login session instantiation
      if (user) {
        let dbUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        // Idempotent User Provisioning: Create record if it does not exist
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: "CUSTOMER", // Default signup state
            },
          });
        }
        token.id = dbUser.id;
        token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Injects properties into client-accessible session states
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
