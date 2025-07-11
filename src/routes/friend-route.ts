import { Router } from "express";
import { getProfileByUsername, getThreadsByUsername } from "../controllers/friend-controller";


const friendRouter = Router()

friendRouter.get("/friend/:username", getProfileByUsername);

friendRouter.get("/friendPs/:username", getThreadsByUsername);


export default friendRouter
