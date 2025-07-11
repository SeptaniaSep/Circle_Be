import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/prismaClien";


// CREATE REPLY
export const createReplyThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parentId } = req.params;
    const { description, image } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: No user in token" });
      return 
    }

    if (!description) {
      res.status(400).json({ message: "Description is required" });
      return 
    }

    const parentThread = await prisma.thread.findUnique({ where: { id: parentId } });

    if (!parentThread) {
      res.status(404).json({ message: "Parent thread not found" });
      return 
    }

    const newReply = await prisma.thread.create({
      data: {
        description,
        image,
        authorId: userId,
        parentThreadId: parentId,
      },
    });

    await prisma.thread.update({
      where: { id: parentId },
      data: { replyCount: { increment: 1 } },
    });

    res.status(201).json({ message: "Reply created", data: newReply });
  } catch (error) {
    console.error("❌ Error caught in controller:", error);
    next(error); 
  }
};


// GET REPLY
export const getReplyThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parentId } = req.params;

    const reply = await prisma.thread.findMany({
      where: { parentThreadId: parentId },
      orderBy: { createdAt: "desc" }, 
      include: {
        author: {
          select: {
            username: true,
            profile: {
              select: {
                avatar: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ message: "Replies fetched", data: reply });
  } catch (error) {
    next(error);
  }
};


// EDIT REPLY


// DELETE REPLYNYA AJA
export const deleteReplyByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const replyId = req.params.id;
    const userId = (req as any).user?.id;

    if (!replyId) {
      res.status(400).json({ message: "Reply ID tidak ditemukan" });
      return 
    }

    const existing = await prisma.thread.findFirst({
      where: {
        id: replyId,
        authorId: userId,
        parentThreadId: { not: null }, // hanya reply
      },
    });

    if (!existing) {
      res.status(404).json({ message: "Reply tidak ditemukan atau bukan milikmu" });
      return;
    }

    await prisma.thread.delete({
      where: { id: replyId },
    });

    res.json({ message: "Reply berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

