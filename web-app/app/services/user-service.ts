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





}
