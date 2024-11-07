import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const fetchAllAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const analyses = await prisma.analysis.findMany();

    if (analyses && analyses.length > 0) {
      res
        .status(200)
        .json({ message: "Analyses fetched successfully", analyses});
      return;
    } else {
      res.status(204).json({ message: "No analyses found" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error.message);
    return;
  }
};

export default fetchAllAnalysis;