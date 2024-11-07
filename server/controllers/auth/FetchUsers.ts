import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const fetchAllUsers = async (req:Request, res:Response): Promise<void> => {
    const users = await prisma.user.findMany();
    if (users && users.length > 0) {
        res.status(200).json({message:"Users fetched successfully",users})
        return;
    }else{
        // No users in the DB I use 204 to show that the data is silent/empty
        res.status(204).json({message:"No Users found - Database is empty"});
        return;
    }
};

export default fetchAllUsers;
