import { Router } from "express";
import { authMiddleware} from "../midlewares/thread-middle";
import { createLikeController, deleteLikeController, findAllLikeController, findLikeController, totalLikeController } from "../controllers/like-controller";


const likeRouter = Router()


likeRouter.post('/like', authMiddleware, createLikeController)
likeRouter.get('/like/total', authMiddleware, findAllLikeController)
likeRouter.get('/like/:threadId', authMiddleware, findLikeController)
likeRouter.get('/like/total/:userId', authMiddleware, totalLikeController)
likeRouter.delete('/unlike', authMiddleware, deleteLikeController)

export default likeRouter