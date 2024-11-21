import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const fetchUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = req.query.userEmail as string;

    if (!userEmail || typeof userEmail !== "string") {
      res.status(400).json({ message: "Invalid email parameter" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    res.status(200).json({
      message: "User found successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default fetchUserByEmail;
