import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as avatarController from './avatar.controller';
import { avatarInterceptor , avatarProcessor } from './avatar.middleware';

const router = express.Router();

/**
 * 上传头像
 */
router.post(
    '/avatar' , 
    authCuard , 
    avatarInterceptor , 
    avatarProcessor , 
    avatarController.store 
);

/**
 * 处理客户端的头像请求
 */

router.get('/users/:userId/avatar' , avatarController.serve );

//默认导出
export default router;