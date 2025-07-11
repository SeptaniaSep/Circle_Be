import { Request, Response, NextFunction } from "express";
import {
    createLikeService,
    deleteLikeService,
    findAll,
    findBy,
    totalLikeUsers 
} from "../services/like-service";

export async function createLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) 

        res.status(404).json({ message: "User not found" });

    const body = {
      ...req.body,
      userId,
    };
    
    const result = await createLikeService(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
  return 
}

export async function findAllLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) 
    
        res.status(404).json({ message: "User not found" });

    const result = await findAll(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
  return 
}

export async function totalLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    if (!userId) 
        
        res.status(404).json({ message: "User not found" });

    const result = await totalLikeUsers(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
  return 
}

export async function findLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const { threadId } = req.params;
    const userId = (req as any).user?.id;

    const result = await findBy(userId, threadId);
    if (!result) {
      res.status(404).json({ message: "Like not found" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { threadId } = req.body;

    const result = await deleteLikeService(userId, threadId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
