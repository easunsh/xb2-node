import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import { fileInterceptor } from './file.middleware';

const router = express.Router();

/**
 * 上传文件
 */

router.post('/files' , authCuard , fileInterceptor , fileController.store );

/**
 * 文件服务接口
 */
router.get('/files/:fileId/serve', fileController.serve);


/**
 * 导出路由
 */
export default router;