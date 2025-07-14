import { Request, Response, NextFunction } from "express";
import {
  createLikeService,
  deleteLikeService,
  getTotalLikesByThreadId,
} from "../services/like-service";
import { prisma } from "../connections/prismaClien";


export async function createLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(404).json({ message: "User not found" });return 
    }

    const body = {
      ...req.body,
      userId,
    };

    const result = await createLikeService(body); 

    res.status(201).json({
      message: result.liked ? "Like added" : "Like removed", 
      threadId: result.threadId,
      total: result.likesCount, 
    });return 
  } catch (error) {
    next(error);
  }
}

export async function totalLikeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { threadId } = req.params;

    if (!threadId) {
      res.status(400).json({ message: "Thread ID is required" });return 
    }

    const result = await getTotalLikesByThreadId(threadId);
    res.status(200).json(result);return 
  } catch (error) {
    next(error);
  }
}


export async function findLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const { threadId } = req.params;
    const userId = (req as any).user?.id;

    const result = await prisma.like.findFirst({
      where: { userId, threadId }
    });

    res.status(200).json({ isLiked: !!result });
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
