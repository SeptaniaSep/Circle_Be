import { GetProfile, profile, UpdateProfile } from "../services/profile-service";
import { Request, Response } from "express";
import { uploadBufferToCloudinary } from "../midlewares/buffer";

export async function getProfileController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    const profile = await GetProfile(userId);

    res.status(200).json({
      message: "Data Profile",
      data: profile
    });
    return 

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
    return 
  }
}


export async function updateProfileController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarFile = files?.avatar?.[0];
    const bannerFile = files?.banner?.[0];

    const dataToUpdate: any = {
      userId,
      username: req.body.username,
      fullname: req.body.fullname,
      bio: req.body.bio,
    };

     
    if (avatarFile) {
      const result: any = await uploadBufferToCloudinary("avatar",avatarFile.buffer, Date.now().toString());
      dataToUpdate.avatar = result.secure_url;
    }

      
    if (bannerFile) {
      const result: any = await uploadBufferToCloudinary("banner",bannerFile.buffer, Date.now().toString());
      dataToUpdate.banner = result.secure_url;
    }

    const updatedProfile = await UpdateProfile(dataToUpdate);
    if (!updatedProfile) {
     res.status(404).json({ message: "Profile not found or unauthorized" });
      return 
    }

    res.status(200).json({
      message: "Update successfully yeey..",
      data: updatedProfile,
    });
    return 

  } catch (error) {
    console.error("Update Profile Error", error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
    return 
  }
}


