import { Request, Response } from "express";

const login = async (req:Request,res:Response) => {

    const {email,password} = req.body;
    if (!email || !password) {
        res.status(400).json({message:"All fields are required"})
    }else{
        const userExists = await SELECT * FROM users WHERE email = email;
        
    }
  

    
}

export default login;