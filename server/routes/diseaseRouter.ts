import express from 'express'
import createDisease from '../controllers/diseases/NewDisease';
import fetchAllDiseases from '../controllers/diseases/FetchAllDiseases';

const diseaseRouter = express.Router();

diseaseRouter.post("/new",createDisease);
diseaseRouter.get("/all",fetchAllDiseases);

export default diseaseRouter;