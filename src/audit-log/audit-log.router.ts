import express from 'express';
import { authCuard, accessControl } from '../auth/auth.middleware';
import * as auditLogController from './audit-log.controller';
import { auditLogGuard, deleteAuditLogGuard } from './audit-log.middleware';

const router = express.Router();

/**
 * 创建审核日志
 */
router.post('/audit-logs', authCuard, auditLogGuard, auditLogController.store);

/**
 * 删除审核日志
 * 自己写着玩的
 */
router.delete(
  '/audit-logs/:logId',
  authCuard,
  deleteAuditLogGuard,
  auditLogController.deleteAuditLogControl,
);

/**
 * 取消审核日志的提交
 */
router.post('/revoke-audit', authCuard, auditLogController.revoke);

/**
 * 导出路由
 */
export default router;
