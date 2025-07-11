import { Router } from "express";
import { authMiddleware } from "../midlewares/thread-middle";
import { followController, getFollowersByUserId, getFollowingByUserId } from "../controllers/follow-controller";



const followRouter = Router()

followRouter.post("/follow", authMiddleware, followController.follow);
followRouter.get("/followers/by-id/:id", getFollowersByUserId);
followRouter.get("/following/by-id/:id", getFollowingByUserId);



export default followRouter