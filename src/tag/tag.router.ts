import express from 'express';
import * as tagController from './tag.controller';
import { authCuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 创建TAG标签
 */

router.post('/tags' , authCuard , tagController.store );

/**
 * 导出路由
 */
export default router;