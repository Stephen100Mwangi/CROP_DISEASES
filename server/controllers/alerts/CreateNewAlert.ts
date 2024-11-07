import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createNewAlert = async (req: Request, res: Response): Promise<void> => {
  const { title, message, location, diseaseId, validUntil } = req.body;
  if (!title || !message || !location || !diseaseId || !validUntil) {
    res.status(400).json({ message: "All fields are required" });
    return;
  } else {
    const validDiseaseId = await prisma.disease.findUnique({
      where: { id: parseInt(diseaseId) },
    });
    if (!validDiseaseId) {
      res.status(400).json({
        message: "Current disease not found-Please provide a valid ID",
      });
      return;
    }

    const validLocation = await prisma.user.findMany({where:{location}});
    // res.status(200).json({message:"Users in ",validLocation})
    if (!validLocation || validLocation.length < 1) {
        res.status(400).json({message:"No user found in the current location"})
        return;        
    }
    try {
      //Do we have a user with such location? - Alerts are tailored to users in specific locations
      const locationFound = await prisma.user.findMany({ where: { location } });

      if (!locationFound || locationFound.length < 0) {
        res.status(404).json({ message: "No farmers found in this location" });
        return;
      }
      const newAlert = await prisma.alert.create({
        data: { title, message, location, diseaseId, validUntil },
      });
      if (newAlert) {
        res
          .status(201)
          .json({ message: "New alert created successfully", newAlert });
        return;
      } else {
        res.status(400).json({ message: "Failed to create an alert" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
};

export default createNewAlert;
