import { prisma } from "../database/index"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class AuthenticationService {

    private static JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";





    private static generateToken(userId: string): string {
        return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: "10d" });
    }

    static verifyJWTToken(token: string): string {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
            return decoded.userId;
        } catch {
            throw new Error("Invalid or expired token");
        }
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { interviews: true },
        });
        if (!user) throw new Error("User not found");
        return user;
    }

    static async checkEmailExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return true;
        }
        return false;
    }




}
