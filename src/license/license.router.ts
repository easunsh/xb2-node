import express from 'express';
import { LICENSE_PER_PAGE } from '../app/app.config';
import { paginate } from '../post/post.middleware';
import { authCuard } from '../auth/auth.middleware';
import * as licenseController from './license.controller';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 有效许可
 */
router.get('/valid-license', authCuard, licenseController.validLicense);

/**
 * 许可列表
 */
router.get(
  '/licenses',
  authCuard,
  paginate(LICENSE_PER_PAGE),
  accessLog({
    action: 'getLicense',
    resourceType: 'license',
  }),
  licenseController.index,
);

/**
 * 导出路由
 */
export default router;
