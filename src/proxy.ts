import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    //Regex matcher protecting routes while omitting internal static files
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};