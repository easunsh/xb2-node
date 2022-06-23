import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import { fileInterceptor , fileProcessor  } from './file.middleware';

const router = express.Router();

/**
 * 上传文件
 */

router.post('/files' , authCuard , fileInterceptor , fileProcessor ,fileController.store );

/**
 * 文件服务接口
 */
router.get('/files/:fileId/serve', fileController.serve);


/**
 * 导出路由
 */
export default router;