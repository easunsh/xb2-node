import express from 'express';
import { paginate } from '../post/post.middleware';
import { accessLog } from '../access-log/access-log.middleware';
import { accessControl, authCuard } from '../auth/auth.middleware';
import * as orderController from './order.controller';
import { ORDERS_PER_PAGE } from '../app/app.config';
import {
  orderGuard,
  updateOrderGuard,
  payOrderGuard,
  orderIndexFilter,
  orderLicenseItemGuard,
} from './order.middleware';

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
 * 订单支付
 */
router.post(
  '/orders/:orderId/pay',
  authCuard,
  payOrderGuard,
  orderController.pay,
);

/**
 * 订单列表
 */
router.get(
  '/orders',
  authCuard,
  paginate(ORDERS_PER_PAGE),
  accessLog({ action: 'getOrders', resourceType: 'order' }),
  orderIndexFilter,
  orderController.index,
);

/**
 * 订单许可项目
 */
router.get(
  '/orders/:orderId/license-item',
  authCuard,
  orderLicenseItemGuard,
  orderController.licenseItem,
);

/**
 * 订单订阅项目
 */
router.get(
  '/orders/:orderId/subscription-item',
  authCuard,
  accessControl({ isAdmin: true }),
  orderController.subscriptionItem,
);

/**
 * 导出路由
 */
export default router;
