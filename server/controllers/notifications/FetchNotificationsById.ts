import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchNotificationsById = async (req:Request,res:Response):Promise<void> => {
    const {id} = req.params;

    if (!id) {
        res.status(400).json({message:"User Id is required"})
        return;
    }else{
        const notifications = await prisma.notification.findMany({where:{userId: parseInt(id)}})
        if (notifications && notifications.length > 0) {
            res.status(200).json({message:"Notifications fetched successfully",notifications})
            return
        }else{
            res.status(404).json({message:"No notifications found for the current user"})
            return;
        }
    }
}

export default fetchNotificationsById;