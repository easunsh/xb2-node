import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import {
  fileDownloadGuard,
  fileInterceptor,
  fileProcessor,
} from './file.middleware';
//access-log
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 上传文件
 */

router.post(
  '/files',
  authCuard,
  fileInterceptor,
  fileProcessor,
  accessLog({
    action: 'createFile',
    resourceType: 'file',
  }),
  fileController.store,
);

/**
 * 查看文件服务接口
 */
router.get('/files/:fileId/serve', fileController.serve);

/**
 * 文件信息查看
 */
router.get(
  '/files/:fileId/metadata',
  accessLog({
    action: 'getFileMetadata',
    resourceType: 'file',
    resourceParamName: 'fileId',
  }),
  fileController.metadata,
);

/**
 * 文件下载
 */
router.get(
  '/files/:fileId/download',
  fileDownloadGuard,
  fileController.download,
);

/**
 * 导出路由
 */
export default router;
