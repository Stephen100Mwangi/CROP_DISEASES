import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
 
const fetchPostsByUserId = async (req:Request,res:Response):Promise<void> => {
    const {userId} = req.params
    if (!userId) {
        res.status(400).json({message:"UserID must be provided"})
        return;        
    }

    const myPosts = await prisma.forumPost.findMany({where:{userId: parseInt(userId)}})

    if (myPosts && myPosts.length > 0) {
        res.status(200).json({message:"Forum posts fetched successfully",myPosts})
        return;
    } else {
        res.status(404).json({message:"No forum posts found for current user"})
        return;
    }
    
}

export default fetchPostsByUserId