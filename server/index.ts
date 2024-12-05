import express from 'express'
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import authRouter from './routes/authRouter'
import diseaseRouter from './routes/diseaseRouter';
import analysisRouter from './routes/analysisRouter';
import forumPostRouter from './routes/forumPostsRouter';
import notificationsRouter from './routes/notificationsRouter';
import alertRouter from './routes/alertRouter';
import imageRouter from './routes/imageRouter';
import messageRouter from './routes/messageRoute';
import commentRouter from './routes/commentRouter';

dotenv.config();

const app = express();

// Setting up the middlewares
app.use(express.json());
app.use(cors())


// Routes
app.use('/auth',authRouter)
app.use('/diseases',diseaseRouter)
app.use('/analysis',analysisRouter)
app.use('/forumPosts',forumPostRouter)
app.use('/notifications',notificationsRouter)
app.use('/alerts',alertRouter);
app.use('/imageUpload',imageRouter);
app.use('/messages',messageRouter)
app.use('/comments',commentRouter)


// Health Check
app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"Welcome to CROPS DISEASES DETECTION app"})
    return;
})

// Listen to server
const PORT = process.env.PORT || 5650;
app.listen (PORT,()=>{
    console.log(`App running well on port http://localhost:${PORT}`);
})