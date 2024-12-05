import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const fetchAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany();
    if (comments.length === 0) {
      res.status(204).json({ message: "No comments found" });
      return;
    } else {
      res.status(200).json({ message: "Comments fetched successfully",comments});
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
