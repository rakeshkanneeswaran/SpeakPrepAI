/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserService } from "@/app/services/user-service";

export async function DELETE() {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        await UserService.deleteAccount(userId);

        return NextResponse.json({ message: "Account deleted" });
    } catch (e: any) {
        return NextResponse.json(
            { message: e.message || "Internal server error" },
            { status: 500 }
        );
    }
}
