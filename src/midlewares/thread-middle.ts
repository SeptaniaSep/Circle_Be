import { Request, Response, NextFunction } from "express";
import { TokenPayload, verifyToken } from "../utils/jwt";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
 
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded =await verifyToken(token); 
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
}
