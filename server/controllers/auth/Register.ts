import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import PrismaClient which is a class from @prisma/client
import { PrismaClient } from "@prisma/client";
// Instance of a PrismaClient
const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, profilePicture } = req.body;
  if (!name || !email || !role || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  } else {
    try {
      // Checking if we we have a user with the  current email
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
      } else {
        // Create a new user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: { name, email, password: hashPassword, profilePicture, role },
        });

        // Create a token
        const SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!SECRET) {
          res.status(400).json({ message: "No secret found" });
        } else {
          const token = jwt.sign({ email }, SECRET, { expiresIn: "7d" });
          res
            .status(201)
            .json({ message: "New user created successfully", token, newUser });
        }
      }
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Internal Server error" });
      return;
    }
  }
};

export default registerUser;
