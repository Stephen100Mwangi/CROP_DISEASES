import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

const loginUser = async (req:Request, res:Response): Promise<void> => {
    const { email, password} = req.body;
    if(!email || !password){
        res.status(400).json({message:"All fields are required"})
        return;
    }

    try {
        const userExists = await prisma.user.findUnique({where:{email}});

        if (!userExists) {
            res.status(400).json({message:"Invalid login credentials"})
            return;
        }else{
            const correctPassword = await bcrypt.compare(password,userExists.password);
            if (!correctPassword) {
                res.status(400).json({message:"Invalid login credentials"})
                return;
            }else{

                // Create a token
                const SECRET = process.env.ACCESS_TOKEN_SECRET;
                if (!SECRET) {
                    res.status(400).json({message:"No secret found"})
                }else{
                    const token = jwt.sign({email}, SECRET,{expiresIn:'7d'})
                    res.status(200).json({message:"Login successful",token,userExists})
                }
            }
        }
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
    
}

export default loginUser
