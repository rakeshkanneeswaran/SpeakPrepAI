import { prisma } from "../database/index";

export class UserService {
    // Create onboarding profile (only used when user fills onboarding form)
    static async createUserProfile(
        userId: string,
        apiChoice: string,
        apiKey: string,
        role: string,
        platformedManagedAPIKey: boolean
    ) {
        const userProfile = await prisma.$transaction(async (tx) => {
            const settings = await tx.userSettings.create({
                data: {
                    userId,
                    apiChoice,
                    apiKey,
                    role,
                    platformedManagedAPIKey,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: { onboarded: true },
            });

            return settings;
        });

        return { onboarded: true };
    }

    // Onboarding status
    static async getUserOnboardingStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboarded: true },
        });

        if (!user) throw new Error("User not found");

        return { onboarded: user.onboarded };
    }

    // Returns ONLY settings — used internally
    static async getUserSettings(userId: string) {
        const settings = await prisma.userSettings.findUnique({
            where: { userId },
        });

        if (!settings) throw new Error("User settings not found");

        return settings;
    }

    // Main user profile for settings page
    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                onboarded: true,
            },
        });

        if (!user) throw new Error("User not found");

        const settings = await prisma.userSettings.findUnique({
            where: { userId },
        });

        return { user, settings };
    }

    // Update profile + settings
    static async updateUserProfile(
        userId: string,
        updates: {
            name?: string;
            apiKey?: string;
            apiChoice?: string;
            role?: string;
        }
    ) {
        return await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    ...(updates.name && { name: updates.name }),
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });

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
                    platformedManagedAPIKey: false,
                },
            });

            return { user: updatedUser, settings: updatedSettings };
        });
    }
}
