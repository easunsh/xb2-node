import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comments' , authCuard , commentController.store );


/**
 * 导出
 */
 export default router;