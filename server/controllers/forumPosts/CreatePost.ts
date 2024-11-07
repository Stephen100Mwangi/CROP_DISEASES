import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewPost = async (req: Request, res: Response): Promise<void> => {
  const { userId, title, content, tags, comments, likesCount } = req.body;
  if (!userId) {
    res.status(400).json({message:"User ID cannot be empty"})
    return;    
  }

  const newPost = await prisma.forumPost.create({data:{userId,title,content,tags,comments,likesCount}})

  res.status(201).json({message:"New Posts created successfully",newPost});
  return;
};

export default createNewPost;
