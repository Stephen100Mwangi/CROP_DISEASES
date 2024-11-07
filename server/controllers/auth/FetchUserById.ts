import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const fetchUserById = async (req:Request,res:Response):Promise<void> => {
    const {userId} = req.params;
    const user = await prisma.user.findUnique({where:{id: parseInt(userId)}})

    if (!user) {
        res.status(404).json({message:"No user found"})
        return;        
    }else{
        res.status(200).json({message:"User found successfully",user})
        return;
    }
    
}

export default fetchUserById

