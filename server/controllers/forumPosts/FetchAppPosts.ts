import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

const fetchAllPosts = async(req:Request,res:Response):Promise <void>=>{
    const forumPosts = await prisma.forumPost.findMany();

    if (forumPosts && forumPosts.length > 0) {
        res.status(200).json({message:"Forum posts retrieved successfully",forumPosts})
        return;
        
    }else{
        res.status(204).json({message:"No forum posts found"})
        return;
    }
}

export default fetchAllPosts;