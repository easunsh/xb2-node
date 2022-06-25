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
 * 查看文件服务接口
 */
router.get('/files/:fileId/serve', fileController.serve);

/**
 * 文件信息查看
 */
router.get('/files/:fileId/metadata', fileController.metadata);


/**
 * 导出路由
 */
export default router;