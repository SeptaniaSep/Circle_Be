import { Router } from "express";
import { 
    createThreedController,  
    editThreadByIdController, 
    getAllThreadController, 
    getThreadByIdThreadController, 
    getThreadByIdUserController
} from "../controllers/thread-controller";
import {deleteThreadByIdController} from "../controllers/thread-controller";


import { authMiddleware } from "../midlewares/thread-middle";
import { upload } from "../midlewares/multer";


const threadRouter = Router()

threadRouter.get('/threads', authMiddleware, getAllThreadController)

threadRouter.get('/threadbi', authMiddleware, getThreadByIdUserController)

threadRouter.get('/thread/:id', authMiddleware, getThreadByIdThreadController)

// threadRouter.post('/thread',  authMiddleware, upload.single("image"), createThreedController)

threadRouter.post('/thread',  authMiddleware, createThreedController)

threadRouter.patch('/thread/:id', authMiddleware, editThreadByIdController)

threadRouter.delete('/thread/:id', authMiddleware, deleteThreadByIdController)

export default threadRouter
