import express from 'express';
import { createComment } from '../controllers/comment/Create';
import { getCommentsForPost } from '../controllers/comment/Create';
import { fetchAllComments } from '../controllers/comment/FetchComments';

const commentRouter = express.Router();

commentRouter.post('/new', createComment);
commentRouter.get('/posts/:postId/comments', getCommentsForPost);
commentRouter.get('/all',fetchAllComments);

export default commentRouter;
