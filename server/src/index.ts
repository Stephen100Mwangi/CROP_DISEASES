import express,{ Request, Response} from 'express'
import cors from 'cors'
import pool from './db'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4550;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes


// Health Check
app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"Welcome to TS+Express+POSTGRES Backend"})
    return;
})


// Listen to port
app.listen(PORT, ()=>{
    console.log(`Server running well on port http://localhost:${PORT}`);
})

