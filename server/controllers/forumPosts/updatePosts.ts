import { Request, Response } from "express"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const updatePost = async (req:Request, res:Response) => {
    const { title, content, tags } = req.body;
    const { postId } = req.params;

    if(!postId){
        res.status(400).json({message:"Post ID must be provided"})
        return;
    }
    if(!title || !content ){
        res.status(400).json({message:"All fields must be provided"})
        return;
    }

    try {
        const postFound = await prisma.forumPost.findUnique({where:{id:parseInt(postId)}})
        if(!postFound){
            res.status(404).json({message:"No post found"})
            return;
        }

        const updatedPost = await prisma.forumPost.update({where:{id:parseInt(postId)},data:{title,content}})

        res.status(200).json({message:"Post updated successfully",updatedPost})
        return;       

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
    
}

export default updatePost