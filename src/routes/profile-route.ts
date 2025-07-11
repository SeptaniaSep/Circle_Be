import { Router } from "express";
import { authMiddleware } from "../midlewares/thread-middle";
import { getProfileController, updateProfileController } from "../controllers/profile-controller";
import { checkCustomFileSize, upload } from "../midlewares/multer";
import { getAllUser } from "../controllers/auth-controller";



const profileRouter = Router()

profileRouter.get('/profile', authMiddleware, getProfileController)

profileRouter.get('/search', authMiddleware, getAllUser)

profileRouter.patch(
  "/profile",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateProfileController
);


export default profileRouter