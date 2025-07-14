import express from "express";
import { authMiddleware } from "../midlewares/thread-middle";
import { createReplyThread, deleteReplyByIdController, getReplyThread } from "../controllers/replay-controller";

const replayRouter = express.Router();

replayRouter.post("/threads/:parentId/reply", authMiddleware, createReplyThread);

replayRouter.get("/threads/:parentId/reply", getReplyThread);

replayRouter.delete("/reply/:id", authMiddleware, deleteReplyByIdController);

export default replayRouter;