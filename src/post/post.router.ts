import express from 'express';

//引入POST 的 controller
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware'; 

//开始用ROUTER
const router = express.Router();


/**
 * 
 * 获得内容列表
 */
//get 方法   postController中的index方法
router.get('/posts', requestUrl, postController.index );


/**
 * 
 * 创建内容
 * 
 */
router.post('/posts',postController.store);


export default router;