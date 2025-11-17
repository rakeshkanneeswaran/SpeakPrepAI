import { auth } from "@/auth";
import { UserService } from "@/app/services/user-service";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const profile = await UserService.getUserProfile(session.user.id);
        return new Response(JSON.stringify(profile), { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message }), { status: 400 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await req.json();
        const updated = await UserService.updateUserProfile(session.user.id, body);
        return new Response(JSON.stringify(updated), { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message }), { status: 400 });
    }
}
