import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { accessControl, authCuard } from '../auth/auth.middleware';
import * as orderController from './order.controller';
import { orderGuard, updateOrderGuard } from './order.middleware';

const router = express.Router();

/**
 * 创建订单
 */
router.post(
  '/orders',
  authCuard,
  orderGuard,
  accessLog({
    action: 'createOrder',
    resourceType: 'order',
  }),
  orderController.store,
);

/**
 * 更新订单
 */
router.patch(
  '/orders/:orderId',
  authCuard,
  accessControl({ possession: true }),
  updateOrderGuard,
  accessLog({
    action: 'updateOrder',
    resourceType: 'order',
    resourceParamName: 'orderId',
  }),
  orderController.update,
);

/**
 * 导出路由
 */
export default router;
