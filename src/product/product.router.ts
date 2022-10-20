import express from 'express';
import * as productController from './product.controller';

const router = express.Router();

/**
 * 获取许可产品
 */
router.get('/products/license', productController.showLicenseProduct);

/**
 * 获取订阅产品
 */

router.get('/products/subscription', productController.showSubscriptionProduct);
//导出路由
export default router;
