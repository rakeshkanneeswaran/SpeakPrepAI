import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./app/database"

export const runtime = "nodejs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    events: {
        async createUser({ user }) {
            if (!user.id) return;

            console.log("New user created:", user.id);

            const existing = await prisma.userSettings.findUnique({
                where: { userId: user.id },
            });

            if (!existing) {
                await prisma.userSettings.create({
                    data: {
                        userId: user.id,
                        credits: 5,
                    },
                });
                await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        type: "FREE",
                        credits: 5,
                        status: "SUCCESS",
                    },
                });
            }
        },
    }
})
