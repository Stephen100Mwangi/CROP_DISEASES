import express from 'express'
import createNewImage from '../controllers/imageUploads/CreateImage';

const imageRouter = express.Router();
imageRouter.post('/new',createNewImage)

export default imageRouter;