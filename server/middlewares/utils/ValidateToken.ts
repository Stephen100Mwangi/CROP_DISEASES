// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user: jwt.JwtPayload | string;
}

export class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!SECRET) {
      throw new AuthError(500, "Server configuration error-No SECRET setup");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthError(401, "Access denied - No token provided");
    }

    const [bearer, token] = authHeader.split(" ");
    // Bearer token
    if (bearer !== "Bearer" || !token) {
      throw new AuthError(401, "Invalid authorization format");
    }

    try {
      const decoded = jwt.verify(token, SECRET);
      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError(403, "Token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError(403, "Invalid token");
      }
      throw new AuthError(403, "Token validation failed");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Auth middleware error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};