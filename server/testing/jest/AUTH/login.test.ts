import { mocked } from 'ts-jest/utils'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jest from 'jest'
import { PrismaClient, User } from '@prisma/client'
import loginUser from '../../../controllers/auth/Login'


// Type-safe mocking
jest.mock('@prisma/client',()=>{
    return {
        prismaClient: jest.fn().mockImplementation(()=>{
            user:{
                
            }
        })
    }
})
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
