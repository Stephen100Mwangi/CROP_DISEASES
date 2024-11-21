import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const loginChat = async (req:Request, res:Response): Promise<void> => {

    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({message:"User email and password must be provided"})
        return;
    }

    const userExists = await prisma.user.findUnique({where:{email}});
    if (!userExists) {
        res.status(404).json({message:"User does not exists"})
        return;
    }else{
        const correctPassword = await bcrypt.compare(password,userExists.password);
        if (!correctPassword) {
            res.status(400).json({message:"Invalid login credentials"})
            return;
        }else{
            // Login the user
            const SECRET = process.env.CHAT_TOKEN_SECRET;
            if (!SECRET) {
                res.status(404).json({message:"Token NOT Found"})
                return;
            }
            const token = jwt.sign({email},SECRET,{expiresIn:'30d'})
            res.status(200).json({message:"User login successful",token,userExists})
            return;
        }
    }
}

export default loginChat