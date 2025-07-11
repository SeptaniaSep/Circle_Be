import { Router } from "express";
import * as userController from "../controllers/auth-controller";


const userRouter = Router()

userRouter.post('/register', userController.registerController)

userRouter.post('/login', userController.loginController)


export default userRouter