import { NextFunction, Request, Response } from "express";
import { ThreedSchema } from "../validation/thraed-validation";
import { CreateThreed, EditByIdThread, GetAllThread, GetByIdThread, GetByIdUser} from "../services/thread-service";
import { prisma } from "../connections/prismaClien";
import cloudinary from "../utils/cloudinary";

// CREATE THREAD 
export async function createThreedController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized. User not found!" });
      return;
    }

    let imageUrl: string | null = null;

    const filePath = req.file?.path;
    if (filePath) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "my-app-images",
      });
      imageUrl = result.secure_url;
    }

    await ThreedSchema.validateAsync({
      description: req.body.description,
      image: imageUrl,
    });

    const saved = await CreateThreed({
      authorId: userId,
      description: req.body.description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: {
        description: saved.description,
        image: saved.image,
      },
    });
  } catch (err: any) {
    if (err.isJoi) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Failed to post thread" });
  }
}


// GET THREAD ALL => HOME
export async function getAllThreadController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; 

    if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
      return 
    }
    const threads = await GetAllThread();

    res.status(200).json({
      message: "All threads by user",
      data: threads
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}

// GET THREAD BY ID USER => POST ALL
export async function getThreadByIdUserController(req: Request, res: Response) {
  try {
    const authorId = (req as any).user?.id;
    if (!authorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const thread = await GetByIdUser(authorId);
    if (!thread) {
      res.status(404).json({ message: "Thread not found or unauthorized" });
      return;
    }
    res.json({
      message: "Thread found",
      data: thread
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
}


// GET THREAD BY ID THREAD => DETAIL STATUS
export async function getThreadByIdThreadController(req: Request, res: Response) {
  try {
    const authorId = (req as any).user?.id; 
    if (!authorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const thread = await GetByIdThread(id); 

    if (!thread) {
      res.status(404).json({ message: "Thread not found" });
      return;
    }

    res.status(200).json({
      message: "Thread found",
      data: thread,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}


// EDIT THREAD 
export async function editThreadByIdController(req: Request, res: Response) {
  try {
    
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { description, image } = req.body

    if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const edit = await EditByIdThread(id, userId, {description, image});

     if(!edit) {
      res.status(404).json({message: "Thread not found or unauthorized"})
     }

    res.status(200).json({
      message: "Update Successfully yeey..",
      data: edit
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}


// DELETE THREAD SAMA REPLYNYA JUGA DI DELETE
export const deleteThreadByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const threadId = req.params.id;
    const userId = (req as any).user?.id;

    const existing = await prisma.thread.findFirst({
      where: {
        id: threadId,
        authorId: userId,
        parentThreadId: null, 
      },
    });

    if (!existing) {
      res.status(404).json({ message: "Thread tidak ditemukan" });
      return
    } 

    await prisma.thread.delete({
      where: { id: threadId },
    });

    res.json({ message: "Thread berhasil dihapus beserta reply-nya" });
  } catch (error) {
    next(error);
  }
  return 
};


