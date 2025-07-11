import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/auth-validation";
import { GetAllUsersService, GetProfile, loginService, registerService } from "../services/auth-service";


// ==== Register ==== //
export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await registerSchema.validateAsync(req.body)

        const user = await registerService(req.body)
        
        res.status(201).json(user)
    } catch (error: any) {
        next(error)
    }
}


// GET /profile
export async function getProfileController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    const profile = await GetProfile(userId); // ambil dari prisma
     res.status(200).json({
      message: "Data Profile",
      data: profile,
    });
    return
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// ==== Login ==== //
export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await loginSchema.validateAsync(req.body)

        const token = await loginService(req.body)
        res.status(200).json({message: "login berhasil", token})
    } catch (error: any) {
        console.error("Login error:", error)
        next(error)
    }
}


// === GET ALL USER === //
export async function getAllUser(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const users = await GetAllUsersService(userId);

    res.status(200).json({
      message: "All users (excluding current user)",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}
