import { prisma } from "../database/index"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class AuthenticationService {

    private static JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";

    static async registerUser(email: string, password: string, name?: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const token = this.generateToken(user.id);
        return { user, token };
    }

    static async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        const token = this.generateToken(user.id);
        return { user, token };
    }

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
