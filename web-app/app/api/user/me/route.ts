import { auth } from "@/auth";
import { UserService } from "@/app/services/user-service";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }
    try {
        const me = await UserService.getUserProfile(session.user.id);

        return new Response(
            JSON.stringify({
                image: me.user.image,
                name: me.user.name,
                credits: me.settings?.credits
            }),
            { status: 200 }
        );
    } catch (err: unknown) {
        return new Response(
            JSON.stringify({ message: err instanceof Error ? err.message : "An error occurred" }),
            { status: 400 }
        );
    }
}