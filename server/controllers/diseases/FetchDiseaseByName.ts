import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const fetchDiseaseByName = async (req:Request,res:Response) => {
    const {name} = req.query;
    if (!name || typeof name !== "string") {
        res.status(400).json({message:"Disease name must be provided and must be a string"})
        return;        
    }else{
        const diseaseFound = await prisma.disease.findUnique({where:{name}})

        if (!diseaseFound) {
            res.status(404).json({message:"No such disease found"});
            return;
        }else{
            res.status(200).json({message:"Disease found successfully", diseaseFound})
            return;
        }
    }
}

export default fetchDiseaseByName