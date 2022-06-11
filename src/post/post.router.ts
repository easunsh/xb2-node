import express from 'express';

//引入POST 的 controller
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware'; 

//开始用ROUTER
const router = express.Router();

//get 方法   postController中的index方法
router.get('/posts', requestUrl, postController.index );

export default router;