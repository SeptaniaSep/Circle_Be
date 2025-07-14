
import { prisma } from "../connections/prismaClien"

interface thread {
    description: string,
    image?: string | null,
    authorId: string ,
}


export async function CreateThreed(data: thread) {
    const thread = await prisma.thread.create({
        data: { 
            authorId: data.authorId,
            description: data.description,
            image: data.image ?? null,
        }
    })

    return {
        description: thread.description,
        image: thread.image 
    }
}


export async function GetAllThread(userId: string) {
  const threads = await prisma.thread.findMany({
    where: {
      parentThreadId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      replyCount: true,
      like: {
        select: {
          userId: true,
        },
      },
      author: {
        select: {
          id: true,
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

  return threads.map((thread) => ({
    ...thread,
    likesCount: thread.like.length,
    isLikedUser: thread.like.some((like) => like.userId === userId),
  }));
}



export async function GetByIdUser(authorId:string){
    return await prisma.thread.findMany({ 

        // where itu mencari spesific
        where: {
            authorId,
            parentThreadId: null,
        },

        orderBy: {
            createdAt: "desc",
        },

        
        include:{
            author:{
                select:{
                    id: true,
                    username: true,
                    profile: {
                        select: {
                            avatar: true,
                            fullname: true,
                        }
                    }

                },
            },
            
        }
        
    })
}


export async function GetByIdThread(threadId: string) {
  return await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              avatar: true,
              fullname: true,
            },
          },
        },
      },
      replies: {
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
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}



export async function EditByIdThread(
  id: string,
  authorId: string,
  data: { description?: string; image?: string | null }
) {
  // untuk Cek apakah thread-nya milik user ini
  const thread = await prisma.thread.findFirst({
    where: { id, authorId },
  });

  // dia marah kalo tidak ada atau bukan milik user
  if (!thread) return null; 

  return await prisma.thread.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
}


export async function deleteThreadById(id: string, userId: string) {
  // Pastikan thread milik user yang sedang login
  const existing = await prisma.thread.findFirst({
    where: {
      id,
      authorId: userId,
    },
  });

  if (!existing) return null;

  return prisma.thread.delete({
    where: { id },
  });
}
