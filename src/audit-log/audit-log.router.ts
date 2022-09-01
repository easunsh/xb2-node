import express from 'express';
import { authCuard } from '../auth/auth.middleware';
import * as auditLogController from './audit-log.controller';
import { auditLogGuard } from './audit-log.middleware';

const router = express.Router();

/**
 * 创建审核日志
 */
router.post('/audit-logs', authCuard, auditLogGuard, auditLogController.store);

/**
 * 导出路由
 */
export default router;
