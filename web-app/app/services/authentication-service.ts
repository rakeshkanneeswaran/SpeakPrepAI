import { prisma } from "../database/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthenticationService {
  /**
   * Get the JWT secret from the environment.
   *
   * We intentionally do NOT provide a fallback secret.
   * If JWT_SECRET is missing, the application should fail
   * rather than use an insecure predictable secret.
   */
  private static getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return secret;
  }

  /**
   * Hash a user's password before storing it in the database.
   *
   * The plain-text password is NEVER stored.
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare a plain-text password with the bcrypt hash
   * stored in PostgreSQL.
   */
  static async verifyPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Generate a JWT containing the user's ID.
   */
  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.getJWTSecret(),
      {
        expiresIn: "10d",
      }
    );
  }

  /**
   * Verify a JWT and return the user ID.
   *
   * Throws an error if the token is invalid or expired.
   */
  static verifyJWTToken(token: string): string {
    try {
      const decoded = jwt.verify(
        token,
        this.getJWTSecret()
      ) as { userId: string };

      if (!decoded.userId) {
        throw new Error("Invalid token payload");
      }

      return decoded.userId;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Check whether an email is already registered.
   */
  static async checkEmailExists(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    return !!user;
  }

  /**
   * Register a new user.
   */
  static async registerUser(
    name: string,
    email: string,
    password: string
  ) {
    const normalizedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    // Basic validation
    if (!normalizedName) {
      throw new Error("Name is required");
    }

    if (!normalizedEmail) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    // Hash the password
    const passwordHash = await this.hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: passwordHash,
      },
    });

    // Generate JWT
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  /**
   * Authenticate an existing user.
   */
  static async loginUser(
    email: string,
    password: string
  ) {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      throw new Error("Email and password are required");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Don't reveal whether the email exists
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password with stored bcrypt hash
    const passwordValid = await this.verifyPassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  /**
   * Get a user by their ID.
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        interviews: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Get a user from a JWT token.
   */
  static async getUserFromToken(token: string) {
    const userId = this.verifyJWTToken(token);

    return this.getUserById(userId);
  }
}