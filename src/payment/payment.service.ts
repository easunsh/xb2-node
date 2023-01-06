import { PaymentModel, PaymentStatus } from './payment.model';
import { connection } from '../app/database/mysql'; //数据库连接
import { getOrderById, updateOrder } from '../order/order.service';
import { OrderStatus } from '../order/order.model';
import { createdOrderLog } from '../order-log/order-log.service';
import { OrderLogAction } from '../order-log/order-log.model';
import { getProductById } from '../product/product.service';
import { ProductStatus, ProductType } from '../product/product.model';
import { getLicenseByOrderId, updateLicense } from '../license/license.service';
import { LicenseStatus } from '../license/license.model';
import { postProcessSubscription } from '../subscription/subscription.service';
import { socketIoServer } from '../app/app.server';
/**
 * 获取支付方法
 */

export interface GetPaymentOptions {
  status?: PaymentStatus;
}
export const getPayments = async (options: GetPaymentOptions = {}) => {
  const { status = 'published' } = options;

  //准备查询
  const statement = `
SELECT
    payment.id,
    payment.name,
    payment.title,
    payment.description,
    payment.meta
FROM
    payment
WHERE
    payment.status = ?
ORDER BY payment.index ASC
`;
  //执行
  const [data] = await connection.promise().query(statement, status);
  //提供结果
  return data as PaymentModel;
};

/**
 * 已经收到付款
 * 用户支付完成后，支付接口会把支付结果发给应用，在验证这个通知有效后，我们会调
用方法去处理收到付款以后的事情。paymentRecived

 */

export const paymentRecived = async (orderId: number, paymentResult: any) => {
  //check order
  const order = await getOrderById(orderId);
  const isVaildOrder = order && order.status === OrderStatus.pending;

  // if the order is enable
  if (!isVaildOrder) return;

  // create order log, have pay recived
  await createdOrderLog({
    userId: order.userId,
    orderId: order.id,
    action: OrderLogAction.orderPaymentRecived,
    meta: JSON.stringify(paymentResult),
  });

  //update the order status
  await updateOrder(order.id, { status: OrderStatus.completed });

  // create order log , order finish
  await createdOrderLog({
    userId: order.userId,
    orderId: order.id,
    action: OrderLogAction.orderStatusChanged,
    meta: JSON.stringify({
      status: OrderStatus.completed,
    }),
  });

  //checkout products
  const product = await getProductById(order.productId);
  const isValidProduct = product && product.status === ProductStatus.published;

  if (!isValidProduct) return;

  //socketId
  //微信支付attach或支付宝支付passback_params
  const socketId = paymentResult.attach || paymentResult.passback_params;
  const isVaildSocketId = socketId && socketId !== 'NULL';

  //许可产品
  if (product.type === ProductType.license) {
    const license = await getLicenseByOrderId(order.id);
    const isValidLicense = license && license.status === LicenseStatus.pending;

    if (!isValidLicense) return;

    await updateLicense(license.id, {
      status: LicenseStatus.valid,
    });

    if (isVaildSocketId) {
      socketIoServer.to(socketId).emit('licenseStatusChanged', {
        ...license,
        status: LicenseStatus.valid,
      });
    }
  }

  //订阅产品
  if (product.type === ProductType.subscription) {
    await postProcessSubscription({ order, product, socketId });
  }
};
