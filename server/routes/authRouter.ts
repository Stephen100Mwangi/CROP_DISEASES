import express from 'express'
import registerUser from '../controllers/auth/Register';
import loginUser from '../controllers/auth/Login';

const authRouter = express.Router();

authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);

export default authRouter