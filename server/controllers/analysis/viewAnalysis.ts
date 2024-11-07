import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma =new PrismaClient();

const fetchMyAnalysis = async (req:Request,res:Response) => {
    const myAnalysis = await prisma.analysis.findMany();

    if (myAnalysis && myAnalysis.length > 0) {
        res.status(200).json({message:"Analysis fetched successfully",myAnalysis})
        return;
    }else{
        res.status(204).json({message:"No analysis for current user found"})
        return;
    }
    
}

export default fetchMyAnalysis