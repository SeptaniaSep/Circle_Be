import { Prisma } from "@prisma/client";
import { prisma } from "../connections/prismaClien";

export interface profile {
  userId: string;
  username: string;
  fullname?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  followers?: number;
  following?: number;
}

export async function GetProfile(id: string) {
  const user = await prisma.user.findUnique({
   where: { id },
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
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    fullname: user.profile?.fullname || "",
    avatar: user.profile?.avatar || null,
    banner: user.profile?.banner || null,
    bio: user.profile?.bio || "",
    followers: user._count.follower,
    following: user._count.following,
  };
}

export async function UpdateProfile(data: profile) {
  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: data.userId },
      select: { id: true },
    });

    let updated: any = null;

    if (existingProfile) {
      updated = await prisma.profile.update({
        where: { userId: data.userId },
        data: {
          fullname: data.fullname,
          avatar: data.avatar,
          banner: data.banner,
          bio: data.bio,
        },
      });
    } else {
      updated = await prisma.profile.create({
        data: {
          fullname: data.fullname || "",
          avatar: data.avatar || "",
          banner: data.banner || "",
          bio: data.bio || "",
          userId: data.userId,
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: {
        username: data.username,
      },
    });

    return {
      username: updatedUser.username,
      fullname: updated.fullname,
      avatar: updated.avatar,
      banner: updated.banner,
      bio: updated.bio,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: `Prisma error: ${error.message}`,
      };
    }

    throw {
      statusCode: 500,
      message: "Terjadi kesalahan internal saat update profile",
      error,
    };
  }
}
