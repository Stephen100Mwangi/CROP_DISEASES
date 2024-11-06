import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const fetchAllDiseases = async (req: Request, res: Response): Promise<void> => {
  try {
    const diseases = await prisma.disease.findMany();

    if (diseases && diseases.length > 0) {
      res
        .status(200)
        .json({ message: "Diseases fetched successfully", diseases });
      return;
    } else {
      res.status(204).json({ message: "No diseases found" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error.message);
    return;
  }
};

export default fetchAllDiseases;
