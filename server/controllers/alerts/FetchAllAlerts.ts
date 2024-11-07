import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const fetchAllAlerts = async (req:Request,res:Response) => {
    const allAlerts = await prisma.alert.findMany();
    if (allAlerts && allAlerts.length > 0) {
        res.status(200).json({message:"Alerts fetched successfully",allAlerts})
        return;
    }else{
        res.status(404).json({message:"No alerts found"});
        return;
    }
    
}

export default fetchAllAlerts;