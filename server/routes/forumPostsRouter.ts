import express from 'express'
import fetchAllPosts from '../controllers/forumPosts/FetchAppPosts';
import createForumPost from '../controllers/forumPosts/CreatePost';

import fetchPostsByUserId from '../controllers/forumPosts/fetchPostsById';

const forumPostRouter = express.Router();

forumPostRouter.get('/all',fetchAllPosts);
forumPostRouter.post('/new',createForumPost);
forumPostRouter.get('/findOne/:userId',fetchPostsByUserId);

export default forumPostRouter;