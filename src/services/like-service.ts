import { Prisma, PrismaClient } from "@prisma/client";
import { LikesDto } from "../validation/like-validation";

const prisma = new PrismaClient();

export async function createLikeService(data: LikesDto) {
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: data.userId,
        threadId: data.threadId,
      },
    });

    let liked = true;

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      await prisma.like.create({ data });
    }

    const likesCount = await prisma.like.count({
      where: { threadId: data.threadId },
    });

    return {
      liked,
      likesCount,
      threadId: data.threadId,
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
      message: "Terjadi kesalahan saat like/unlike thread",
      error,
    };
  }
}

export async function deleteLikeService(userId: string, threadId: string) {
  try {
    await prisma.like.deleteMany({
      where: { userId, threadId },
    });

    const likesCount = await prisma.like.count({
      where: { threadId },
    });

    return {
      message: "Berhasil unlike thread",
      likesCount,
    };
  } catch (error) {
    throw {
      statusCode: 500,
      message: "Terjadi kesalahan saat menghapus like",
      error,
    };
  }
}

export async function findBy(userId: string, threadId: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        author: {
          select: {
            username: true,
            profile: {
              select: { fullname: true },
            },
          },
        },
        like: true,
      },
    });

    if (!thread) {
      throw {
        statusCode: 404,
        message: "Thread tidak ditemukan",
      };
    }

    const likesCount = thread.like.length;
    const isLikedUser = thread.like.some((like) => like.userId === userId);

    return {
      ...thread,
      likesCount,
      isLikedUser,
    };
  } catch (error) {
    throw {
      statusCode: 500,
      message: "Gagal mengambil data thread dan likes",
      error,
    };
  }
}

export async function findAll(userId: string) {
  try {
    const threads = await prisma.thread.findMany({
      where: { authorId: userId },
      include: { like: true },
    });

    const totalLike = threads.reduce((acc, thread) => acc + thread.like.length, 0);

    return { userId, totalLike };
  } catch (error) {
    throw {
      statusCode: 500,
      message: "Gagal menghitung total likes user",
      error,
    };
  }
}

export async function totalLikeUsers(userId: string) {
  try {
    const totalLike = await prisma.like.count({
      where: {
        Thread: {
          authorId: userId,
        },
      },
    });

    return { userId, totalLike };
  } catch (error) {
    throw {
      statusCode: 500,
      message: "Gagal menghitung total like pada semua thread user",
      error,
    };
  }
}



// const prisma = new PrismaClient()

// class LikesService {

//     async createLike(dto: LikesDto) {
//         try {
//             const existingLike = await prisma.like.findFirst({
//                 where: {
//                     userId: dto.userId,
//                     threadId: dto.threadId
//                 }
//             })

//             if (existingLike) {
//                 await prisma.like.deleteMany({
//                     where: {
//                         id: existingLike.id
//                     }
//                 })
//             } else {
//                 await prisma.like.create({
//                     data: {
//                         ...dto
//                     }
//                 })
//             }

//             const likesCount = await prisma.like.count({
//                 where: {
//                     threadId: dto.threadId
//                 }
//             })

//             return {
//                 likesCount,
//                 existingLike
//             }
//         } catch (error) {
//             return error
//         }
//     }


//     async deleteLike(userId: string, threadId: string) {
//         try {
//             const unlike = await prisma.like.deleteMany({
//                 where: {
//                     userId,
//                     threadId
//                 }
//             })

//             const likesCount = await prisma.like.count({
//                 where: {
//                     threadId
//                 }
//             })

//             return {
//                 likesCount,
//                 unlike
//             }
//         } catch (error) {
            
//         }
//     }

//     async findBy(userId: string, threadId: string) {
//         try {
//             const thread = await prisma.thread.findUnique({
//                 where: {
//                     id: threadId
//                 },
//                 include: {
//                     author: {
//                         select: {
//                             username: true,
//                             profile: {
//                                 select: {
//                                     fullname: true
//                                 }
//                             }
//                         }
//                     },
//                     like: true
//                 }
//             })

//             if (!thread) throw new Error("Thread not found")
            
//             const likesCount = await prisma.like.count({
//                 where: { threadId },
//             });

//             const isLikedUser = thread.like.some((like) => like.userId === userId);

//             const isOtherUser = thread.like.some((like) => like.userId !== userId);

//             return { ...thread, likesCount, isLikedUser, isOtherUser };
            
//         } catch (error) {
//             return error
//         }
//     }

//     async findAll(userId : string) {
//         try {
//             const threads = await prisma.thread.findMany({
//                 where: {
//                     authorId: userId
//                 },
//                 include: {
//                     like: true
//                 }
//             })

//             const totalLike = threads.reduce(
//                 (acc, thread) => acc + thread.like.length,
//                 0
//             );
//             return { userId, totalLike };
//         } catch (error) {
//             return error
//         }
//     }

//     async totalLikeUsers(userId : string) {
//         try {
//             const totalLike = await prisma.like.count({
//                 where: {
//                     Thread: {
//                         authorId: userId
//                     }
//                 }
//             })

//             return totalLike
//         } catch (error) {
//             return error
//         }
//     }
// }

// export const likesService = new LikesService()