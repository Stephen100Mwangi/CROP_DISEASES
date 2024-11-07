import express from 'express'
import createDisease from '../controllers/diseases/NewDisease';
import fetchAllDiseases from '../controllers/diseases/FetchAllDiseases';
import fetchDiseaseByName from '../controllers/diseases/FetchDiseaseByName'

const diseaseRouter = express.Router();

diseaseRouter.post("/new",createDisease);
diseaseRouter.get("/all",fetchAllDiseases);
diseaseRouter.get('/findByName',fetchDiseaseByName)

export default diseaseRouter;