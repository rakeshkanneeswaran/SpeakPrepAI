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

    static async changePassword(userId: string, oldPassword: string, newPassword: string) {
        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify old password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new Error("Current password is incorrect");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return { success: true, message: "Password updated successfully" };
    }

    static async validatePassword(userId: string, password: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return await bcrypt.compare(password, user.password);
    }

}
