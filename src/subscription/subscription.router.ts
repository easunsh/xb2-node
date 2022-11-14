import express from 'express';
import { authCuard, accessControl } from '../auth/auth.middleware';
import * as subscriptionController from './subscription.controller';

const router = express.Router();

/**
 * 有效订阅
 */

router.get(
  '/valid-subscription',
  authCuard,
  subscriptionController.validSubscription,
);

/**
 * 订阅历史
 */
router.get(
  '/subscriptions/:subscriptionId/history',
  authCuard,
  accessControl({ possession: true }),
  subscriptionController.history,
);
/**
 * 导出路由
 *
 */
export default router;
