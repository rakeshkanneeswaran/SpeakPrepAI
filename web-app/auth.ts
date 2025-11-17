import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./app/database"

export const runtime = "nodejs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        LinkedIn({
            clientId: process.env.AUTH_LINKEDIN_ID!,
            clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
})
