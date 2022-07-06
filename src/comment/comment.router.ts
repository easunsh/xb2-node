import express from 'express';
import { accessControl, authCuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller';
import { filter } from './comment.middleware';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comments' , authCuard , commentController.store );

/**
 * 回复评论
 * 例子 {{ _.xb2_api }}/comments/3/reply   ** 3为要去回复的评论的id
 * reply 是自己取得名字，
 * 
 */

 router.post('/comments/:commentId/reply' , authCuard , commentController.reply );

/**
 * 修改评论
 */
router.patch(
    '/comments/:commentId' ,
    authCuard , 
    accessControl({ possession: true }),
    commentController.update,
    );

/**
 * 删除评论
 */
router.delete(
    '/comments/:commentId' ,
     authCuard ,
     accessControl({ possession: true }),
     commentController.destory,
     
     );

/**
 * 获取评论列表
 */
router.get('/comments' , filter , commentController.index );

/**
 * 导出
 */
 export default router;