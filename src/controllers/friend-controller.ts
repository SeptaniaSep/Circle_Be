import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();


// GET PROFILE BY USERNAME
export const getProfileByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;
  const currentUserId = (req as any).user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            fullname: true,
            avatar: true,
            banner: true,
            bio: true,
          },
        },
        _count: {
          select: {
            follower: true,  
            following: true,
          },
        },
        follower: {
          where: {
            followerId: currentUserId, 
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isFollowed = user.follower.length > 0;

    res.status(200).json({
      data: {
        id: user.id,
        username: user.username,
        profile: {
          fullname: user.profile?.fullname || "",
          avatar: user.profile?.avatar || null,
          banner: user.profile?.banner || null,
          bio: user.profile?.bio || "",
        },
        followers: user._count.follower,
        following: user._count.following,
        isFollowed, 
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};



// GET ALLPOST & MEDIA BY USERNAME
export const getThreadsByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const threads = await prisma.thread.findMany({
      where: {
        authorId: user.id,
        parentThreadId: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { replies: true, like: true },
        },
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

    res.status(200).json({ data: threads });
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
};

