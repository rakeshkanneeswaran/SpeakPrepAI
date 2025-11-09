import { asyncWrapProviders } from "async_hooks";
import { prisma } from "../database/index"
import { on } from "events";

export class UserService {

    static async createUserProfile(userId: string, apiChoice: string, apiKey: string, role: string, platformedManagedAPIKey: boolean) {
        const userProfile = await prisma.$transaction(async (tx) => {
            const userProfile = await tx.userSettings.create({
                data: {
                    userId,
                    apiChoice,
                    apiKey,
                    role,
                    platformedManagedAPIKey
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: { onboarded: true },
            });

            return userProfile;

        })

        return {
            onboarded: true,
        };
    }

    static async getUserOnboardingStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboarded: true },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return { onboarded: user.onboarded };
    }

    static async getUserSettings(userId: string) {
        const userSettings = await prisma.userSettings.findUnique({
            where: { userId: userId },
        });

        if (!userSettings) {
            throw new Error("User settings not found");
        }

        return userSettings;
    }
    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const settings = await prisma.userSettings.findUnique({
            where: { userId }
        });

        return { user, settings };
    }

    static async updateUserProfile(
        userId: string,
        updates: {
            name?: string;
            email?: string;
            apiKey?: string;
            apiChoice?: string;
            role?: string;
        }
    ) {
        return await prisma.$transaction(async (tx) => {
            // Update user
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    ...(updates.name && { name: updates.name }),
                    ...(updates.email && { email: updates.email }),
                },
                select: { id: true, email: true, name: true, updatedAt: true }
            });

            // Update or create settings
            const updatedSettings = await tx.userSettings.upsert({
                where: { userId },
                update: {
                    ...(updates.apiKey && { apiKey: updates.apiKey }),
                    ...(updates.apiChoice && { apiChoice: updates.apiChoice }),
                    ...(updates.role && { role: updates.role }),
                },
                create: {
                    userId,
                    apiKey: updates.apiKey || "",
                    apiChoice: updates.apiChoice || "groq",
                    role: updates.role || "",
                    platformedManagedAPIKey: false
                },
            });

            return { user: updatedUser, settings: updatedSettings };
        });
    }

}