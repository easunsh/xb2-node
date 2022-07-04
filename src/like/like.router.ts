import express from 'express';
import * as likeController from './like.controller';
import { authCuard } from '../auth/auth.middleware';

const router = express.Router();


/**
 * 点赞内容
 */
router.post(
    '/posts/:postId/like', 
    authCuard , 
    likeController.storeUserLikePost
     );

/**
 * 取消点赞内容
 */
router.delete(
    '/posts/:postId/like',
    authCuard,
    likeController.destroyUserLikePost,
    );

/**
 * 导出
 */
 export default router;