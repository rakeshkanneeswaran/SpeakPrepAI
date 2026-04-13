import { prisma } from "../database/index";

export class UserService {


    // Onboarding status
    static async getUserOnboardingStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboarded: true },
        });

        if (!user) throw new Error("User not found");

        return { onboarded: user.onboarded };
    }



    // Main user profile for settings page
    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                settings: true,
            },
        });

        if (!user) throw new Error("User not found");


        const settings = await prisma.userSettings.findUnique({
            where: { userId },
        });

        return { user, settings };
    }

    static async getAvailableCredits(userId: string): Promise<number> {
        const settings = await prisma.userSettings.findUnique({
            where: { userId },
            select: { credits: true },
        });

        if (!settings) {
            throw new Error("User settings not found");
        }
        return settings.credits;

    }



}
