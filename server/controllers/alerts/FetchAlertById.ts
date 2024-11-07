import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchAlertsById = async (req:Request,res:Response):Promise<void> => {
    const {id} = req.params;
    if (!id) {
        res.status(400).json({message:"Disease id must be provided"})
        return;        
    }

    const diseaseAvailable = await prisma.disease.findUnique({where:{id: parseInt(id)}});
    if (!diseaseAvailable) {
        res.status(404).json({message:"No such disease found"})
        return;        
    }

    const alerts = await prisma.alert.findMany({where:{diseaseId:parseInt(id)}})
    if (alerts && alerts.length > 0) {
        res.status(200).json({message:"Alerts fetched successfully",alerts})
        return;
    }else{
        res.status(204).json({message:"No alerts found for this disease"})
        return;
    }
    
}

export default fetchAlertsById;