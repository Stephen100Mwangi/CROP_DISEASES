import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createNewNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, title, message, type, isRead } = req.body;
  if (!userId || !title || !message || !type ) {
    res.status(400).json({message:"All fields are required"})
    return;    
  }

  const newNotification = await prisma.notification.create({data:{userId,title,message,type}});
  res.status(201).json({message:"New notification created successfully",newNotification});
  return;
};

export default createNewNotification;
