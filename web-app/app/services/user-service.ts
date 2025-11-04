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
}