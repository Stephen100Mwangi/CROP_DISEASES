import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchAllNotifications = async (req:Request,res:Response) => {
    const notifications = await prisma.notification.findMany();

    if (notifications && notifications.length > 0) {
        res.status(200).json({message:"Notifications fetched successfully", notifications})
        return;
    }else{
        res.status(404).json({message:"No notifications found"})
        return;
    }
}

export default fetchAllNotifications
