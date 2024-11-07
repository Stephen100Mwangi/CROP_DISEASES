import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createNewImage = async (req: Request, res: Response): Promise<void> => {
  const { userId, imageUrl, uploadDate,fileSize,status } = req.body;
  if (!userId || !imageUrl || !uploadDate || !fileSize) {
    res.status(400).json({message:"All fields must be provided"});
    return;    
  }else{
    // Does user exists
    const users = await prisma.user.findMany();
    if (users.indexOf(users[userId]) === -1) {
        res.status(404).json({message:"No such user exists"});
        return;
    }else{
        const newImage = await prisma.imageUpload.create({data:{userId,imageUrl,uploadDate,fileSize,status}})

        if (!newImage) {
            res.status(400).json({message:"Error uploading image"})
            return;
        }else{
            res.status(201).json({message:"Image uploaded successfully",newImage})
            return;
        }
    }
  }
};

export default createNewImage;
