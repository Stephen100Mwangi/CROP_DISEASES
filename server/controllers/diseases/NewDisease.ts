import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

const prisma = new PrismaClient();

const createDisease = async (req:Request,res:Response): Promise<void> => {
    const {
        name,
        cropType,
        symptoms,
        images,
        causes,
        treatments,
        riskLevel
    } = req.body

    if (!name || !cropType || !symptoms || !images || !causes || !treatments || !riskLevel) {
        res.status(400).json({message:"All fields are required"});
        return;
    }

    try {
        const diseaseExists = await prisma.disease.findUnique({where:{name}});
        if (diseaseExists) {

            // If the disease already exists just add the new images,symptoms

            
        }else{
            const newDisease = await prisma.disease.create({data:{
                name,
                cropType,
                images,
                symptoms,
                causes,
                treatments,
                riskLevel
            }});
            res.status(201).json({message:"Disease created successfully",newDisease});

        }

    } catch (error:any) {
        console.log(error.message);
        res.status(500).json({message:"Something went wrong"});
    }
        
}

export default createDisease