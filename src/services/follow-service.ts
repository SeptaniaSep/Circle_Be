import { prisma } from "../connections/prismaClien";
import { FollowsDto } from "../validation/follow-validation";

// Fungsi utama untuk toggle follow/unfollow
export const followService = async (dto: FollowsDto) => {
  const { followerId, followingId } = dto;

  if (followerId === followingId) {
    throw new Error("You can't follow yourself");
  }

  const user = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!user) {
    throw new Error(`User id ${followingId} not found`);
  }

  const existingFollow = await prisma.following.findUnique({
    where: {
      followerId_followingId: {
        followingId,
        followerId,
      },
    },
  });

  if (existingFollow) {
    await prisma.following.delete({
      where: {
        followerId_followingId: {
            followerId,
            followingId,
        },
      },
    });

    return {
      message: "Unfollowed successfully",
      isFollowing: false,
    };
  }

  const follow = await prisma.following.create({
    data: {
      followingId,
      followerId,
    },
  });

  return {
    message: "Followed successfully",
    isFollowing: true,
    data: follow,
  };
};
