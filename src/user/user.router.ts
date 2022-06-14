import express from 'express';
import * as userControlle from './user.controller';
import { validateUserData, hashPassword } from './user.middleware';

const router = express.Router();

/**
 * 创建用户
 */
 router.post('/users', validateUserData , hashPassword , userControlle.store );

/**
 * 默认导出
 */
export default router;