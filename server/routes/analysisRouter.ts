import express from 'express'
import { validateUser } from '../middlewares/utils/ValidateToken';
import createAnalysis from '../controllers/analysis/createAnalysis';
import fetchAllAnalysis from '../controllers/analysis/fetchAllAnalysis';
import fetchMyAnalysis from '../controllers/analysis/viewAnalysis';

const analysisRouter = express.Router();

analysisRouter.post("/new",validateUser,createAnalysis);
analysisRouter.get("/all",fetchAllAnalysis)
analysisRouter.get("/personal",validateUser,fetchMyAnalysis)

export default analysisRouter;