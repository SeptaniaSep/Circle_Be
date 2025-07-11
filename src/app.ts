import dotenv from "dotenv"
import express from 'express';
dotenv.config();
import userRouter from './routes/auth-route';
import corsMiddleware from './configs/cors';
import threadRouter from "./routes/thread-route";
import path from "path";
import profileRouter from "./routes/profile-route";
import friendRouter from "./routes/friend-route";
import replayRouter from "./routes/replay-route";
import followRouter from "./routes/follow-route";
import likeRouter from "./routes/like-route";



const app = express();
const PORT = process.env.PORT;

app.use(corsMiddleware)

// app.use(express.json())

app.use(express.json({ limit: '10mb' }));


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", 
   userRouter, threadRouter, profileRouter, friendRouter, replayRouter, followRouter, likeRouter);

app.listen(PORT, () => {
   console.log("server is running on port", PORT);
});
