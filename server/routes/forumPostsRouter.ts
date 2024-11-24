import express from 'express'
import fetchAllPosts from '../controllers/forumPosts/FetchAppPosts';
import createForumPost from '../controllers/forumPosts/CreatePost';

import fetchPostsByUserId from '../controllers/forumPosts/fetchPostsById';
import updatePost from '../controllers/forumPosts/updatePosts';

const forumPostRouter = express.Router();

forumPostRouter.get('/all',fetchAllPosts);
forumPostRouter.post('/new',createForumPost);
forumPostRouter.get('/findOne/:userId',fetchPostsByUserId);
forumPostRouter.patch('/:id',updatePost);

export default forumPostRouter;