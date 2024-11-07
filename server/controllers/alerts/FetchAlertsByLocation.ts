import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchAlertsByLocation = async (req:Request,res:Response) => {
    const location = req.query.location as string;

    if (!location) {
        res.status(400).json({message:"Please provide a valid location"})
        return;        
    }else{
        //Do we have a user with such location? - Alerts are tailored to users in specific locations
        const locationFound = await prisma.user.findMany({where:{location}});
        if (!locationFound || locationFound.length === 0) {
            res.status(404).json({message:"No farmers found in this location"})
            return;            
        }else{
            const alertsFound = await prisma.alert.findMany({where:{location}});
            if (!alertsFound) {
                res.status(204).json({message:"No alerts found for this region"})
                return;                
            }else{
                res.status(200).json({message:`Alerts for ${location} region fetched successfully`,alertsFound})
                return;
            }
        }
    }
}

export default fetchAlertsByLocation;