import { AuthenticationService } from "@/app/services/authentication-service";

export async function POST(req: Request) {
    const { email } = await req.json();
    const exists = await AuthenticationService.checkEmailExists(email);
    return Response.json({ exists });
}
