import express from 'express'
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import authRouter from './routes/authRouter'

dotenv.config();

const app = express();

// Setting up the middlewares
app.use(express.json());
app.use(cors())


// Routes
app.use('/auth',authRouter)


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