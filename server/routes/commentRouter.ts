import express from 'express';
import { createComment } from '../controllers/comment/Create';
import { getCommentsForPost } from '../controllers/comment/Create';

const commentRouter = express.Router();

commentRouter.post('/comments', createComment);
commentRouter.get('/posts/:postId/comments', getCommentsForPost);

export default commentRouter;
