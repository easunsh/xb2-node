import express from 'express';
import * as userControlle from './user.controller';
import { 
    validateUserData, 
    hashPassword,
    validateUpdateUserData,
} from './user.middleware';

import { authCuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 创建用户
 */
 router.post(
    '/users', 
    validateUserData , 
    hashPassword , 
    userControlle.store 
);

 /**
  * 显示用户账户
  */
 router.get(
    '/users/:userId',
    userControlle.show
    );


/**
 * 更新用户信息
 * validateUpdateUserData 检查更新的数据，新旧密码，新用户名等，
 */

router.patch(
    '/users',
    authCuard,
    validateUpdateUserData,
    userControlle.update
);

/**
 * 默认导出
 */
export default router;