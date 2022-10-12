import express from 'express';
import * as weixinLoginController from './weixin-login.controller';
import {
  weixinLoginGuard,
  weixinLoginConnector,
} from './weixin-login.middleware';
import { validateLoginData } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';
import { hashPassword } from 'src/user/user.middleware';
const router = express.Router();

/**
 * 微信登录，用户授权重定向
 */
router.get(
  '/weixin-login/callback',
  weixinLoginGuard,
  accessLog({ action: 'weixinLogin', resourceType: 'auth' }),
  weixinLoginController.weixinLoginCallback,
);

/**
 * 微信登录：关联本地账户
 *
 */
router.post(
  '/weixin-login/connect',
  validateLoginData,
  weixinLoginConnector(),
  accessLog({
    action: 'weixinLoginConnect',
    resourceType: 'auth',
  }),
  weixinLoginController.weixinLoginConnect,
);

/**
 * 微信登录： 创建并关联本地账户
 */
router.post(
  'weixin-login/create-connect',
  validateLoginData,
  hashPassword,
  weixinLoginConnector({ isCreateUserRequired: true }),
  accessLog({
    action: 'createUser',
    resourceType: 'user',
    payloadParam: 'body.name',
  }),
  accessLog({
    action: 'weixinLoginConnect',
    resourceType: 'auth',
  }),
  weixinLoginController.weixinLoginCreateConnect,
);

/**
 * 导出路由
 */
export default router;
