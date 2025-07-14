import { Router } from "express";
import { authMiddleware} from "../midlewares/thread-middle";
import { createLikeController, deleteLikeController, findLikeController, totalLikeController } from "../controllers/like-controller";


const likeRouter = Router()


likeRouter.post('/like', authMiddleware, createLikeController)
// likeRouter.get('/like/total', authMiddleware, findAllLikeController)
likeRouter.get('/like/:threadId', authMiddleware, findLikeController)
likeRouter.get('/like/total/:threadId', authMiddleware, totalLikeController)
likeRouter.delete('/unlike', authMiddleware, deleteLikeController)

export default likeRouter