import { compare, hash } from "bcrypt"
import { prisma } from "../connections/prismaClien"
import { signToken, TokenPayload } from "../utils/jwt"
import createHTTPError from "http-errors"
import { profile } from "console"



interface auth {
    username: string
    email: string
    password: string
    fullname?: string
    avatar?: string;
    banner?: string
    bio?: string;
}

export async function registerService(data: auth) {
    const hashPassword = await hash(data.password, 10)
    const avatarURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Chase`
    const bannerUrl = `https://cdn.pixabay.com/photo/2021/10/08/12/59/background-6691304_1280.jpg`

    const user = await prisma.user.create({
        data : {
            username: data.username,
            email: data.email,
            password: hashPassword,
             profile: {
              create: {
              avatar: avatarURL,
              fullname: data.fullname || "",
              banner: bannerUrl,
              bio: data.bio || "",
            },
          },
          },
           
          })

    return user
}

export async function GetProfile(id: string){
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      username: true,
      email: true,
      profile: {
        select: {
          fullname: true,
          avatar: true,
          banner: true,
          bio: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    username: user.username,
    email: user.email,
    fullname: user.profile?.fullname || "",
    avatar: user.profile?.avatar || "",
    banner: user.profile?.banner || "",
    bio: user.profile?.bio || "",
  };
}




export async function loginService(data: auth) {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
        
    })

    if (!user) throw new Error("Email is not registered")
        // console.log("Login data:", data);

        const isValid = await compare(data.password, user.password)
    if (!isValid) {
        throw createHTTPError(401, "wrong password")
    }

        const payload: TokenPayload = { id: user.id }
        const token = signToken(payload)
        return token       
}


export async function GetAllUsersService(currentUserId: string) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          avatar: true,
          banner: true,
          fullname: true,
          bio: true,
        },
      },
      follower: {
        where: {
          followerId: currentUserId, 
        },
        select: {
          id: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    profile: user.profile,
    isFollowed: user.follower.length > 0, 
  }));
}
