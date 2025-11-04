import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";
import { cookies } from "next/headers";


export async function POST(req: Request) {


    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        const userId = AuthenticationService.verifyJWTToken(token);

        let platformedManagedAPIKey = false

        const { apiChoice, apiKey, role } = await req.json();

        if (apiChoice == "managed") {
            platformedManagedAPIKey = true;
        }
        else {
            platformedManagedAPIKey = false;
        }

        const status = await UserService.createUserProfile(userId, apiChoice, apiKey, role, platformedManagedAPIKey);

        return new Response(
            JSON.stringify(status),
            { status: 200 }
        );


    } catch (err) {
        if (err instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Unable to register user" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Unknown error" }),
            { status: 400 }
        );
    }
}
