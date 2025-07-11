import { NextFunction, Request, Response } from "express";
import { followService } from "../services/follow-service";
import { prisma } from "../connections/prismaClien";


export const followController = {
  async follow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const followerId = (req as any).user?.id;
    const { followingId } = req.body;

    try {
      const result = await followService({ followerId, followingId });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
};



// GET FOLLOWING
export const getFollowingByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const following = await prisma.following.findMany({
      where: { followerId: id },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullname: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    const result = following.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      fullname: f.following.profile?.fullname || "",
      avatar: f.following.profile?.avatar || null,
      bio: f.following.profile?.bio || "",
    }));

    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};




// GET FOLLOWERS
export const getFollowersByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const followers = await prisma.following.findMany({
      where: { followingId: id },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullname: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    const result = followers.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      fullname: f.follower.profile?.fullname || "",
      avatar: f.follower.profile?.avatar || null,
      bio: f.follower.profile?.bio || "",
    }));

    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};




