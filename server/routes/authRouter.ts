import express from 'express'
import registerUser from '../controllers/auth/Register';
import loginUser from '../controllers/auth/Login';
import fetchUserById from '../controllers/auth/FetchUserById';
import fetchAllUsers from '../controllers/auth/FetchUsers';
import fetchUserByEmail from '../controllers/auth/FetchUserByEmail';

const authRouter = express.Router();

authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.get('/findOne/:userId',fetchUserById);
authRouter.get('/findAll',fetchAllUsers);
authRouter.get('/findByEmail',fetchUserByEmail)

export default authRouter