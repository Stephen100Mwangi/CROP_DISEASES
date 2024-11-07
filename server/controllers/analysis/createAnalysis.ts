import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAnalysis = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    imageUrl,
    analysisDate,
    detectedDiseaseId,
    confidenceScore,
    recommendations,
    feedbackGiven,
  } = req.body;

  const newAnalysis = await prisma.analysis.create({
    data: {
      userId,
      imageUrl,
      analysisDate,
      detectedDiseaseId, 
      confidenceScore,
      recommendations,
      feedbackGiven,
    },
  });

  res.status(200).json({message:"New analysis created successfully",newAnalysis})
  return;
};

export default createAnalysis;
