import express from 'express';
import * as authController from './auth.controller';
import { authCuard, validateLoginData } from './auth.middleware';

const router = express.Router();

/**
 * 用户登录 
 */
router.post( '/login', validateLoginData , authController.login );

/**
 * 定义令牌验证登录的接口
 */
router.post('/auth/validate' , authCuard, authController.validate );

/**
 * 导出默认
 */
export default router;