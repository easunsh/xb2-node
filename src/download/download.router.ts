import express from 'express';
import { downloadGuard } from './download.middleware';
import * as downloadController from './download.controller';
import { authCuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 创建下载
 */
router.post('/downloads', authCuard, downloadGuard, downloadController.store);

/**
 * 导出路由
 */
export default router;
