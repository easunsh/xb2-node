import express from 'express';
import * as authController from './auth.controller';
import { authCuard, validateLoginData } from './auth.middleware';
//access-log
import { accessLog } from '../access-log/access-log.middleware';
const router = express.Router();

/**
 * 用户登录
 */
router.post(
  '/login',
  validateLoginData,
  accessLog({
    action: 'login',
    resourceType: 'auth',
    payloadParam: 'body.name',
  }),
  authController.login,
);

/**
 * 定义令牌验证登录的接口
 */
router.post('/auth/validate', authCuard, authController.validate);

/**
 * 导出默认
 */
export default router;
