import { Request, Response, NextFunction } from 'express';
import { LicenseStatus } from '../license/license.model';
import { createLicense } from '../license/license.service';
import { ProductType } from '../product/product.model';
import { OrderLogAction } from '../order-log/order-log.model';
import { createdOrderLog } from '../order-log/order-log.service';
import {
  createOrder,
  getOrders,
  updateOrder,
  countOrders,
  getOrderLicenseItem,
  getOrderSubscriptionItem,
} from './order.service';
import { processSubscription } from '../subscription/subscription.service';
import { PaymentName } from '../payment/payment.model';
import { wxpay } from '../payment/wxpay/wxpay.service';
import { alipay } from '../payment/alipay/alipay.service';

/**
 * 创建订单
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user: { id: userId },
    body: { order, resourceType, resourceId, product },
  } = request;

  try {
    //创建订单
    const data = await createOrder(order);
    const { insertId: orderId } = data;
    order.id = orderId;

    //创建订单日志
    await createdOrderLog({
      userId,
      orderId,
      action: OrderLogAction.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });

    //创建许可
    if (product.type === ProductType.license) {
      await createLicense({
        userId,
        orderId,
        status: LicenseStatus.pending,
        resourceType,
        resourceId,
      });
    }

    //创建订阅
    if (product.type === ProductType.subscription) {
      const result = await processSubscription({ userId, order, product });

      if (result) {
        await updateOrder(orderId, { totalAmount: result.order.totalAmount });
        //创建订单日志d
        await createdOrderLog({
          userId,
          orderId,
          action: OrderLogAction.orderUpdated,
          meta: JSON.stringify({
            totalAmount: result.order.totalAmount,
          }),
        });
      }
    }
    //做出响应
    response.status(201).send(data);
    //下一步
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 更新订单
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    body: { dataForUpdate, order },
    user,
  } = request;

  try {
    //更新订单
    const data = await updateOrder(order.id, dataForUpdate);

    //创建订单日志
    await createdOrderLog({
      userId: user.id,
      orderId: order.id,
      action: OrderLogAction.orderUpdated,
      meta: JSON.stringify({
        ...dataForUpdate,
      }),
    });

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单支付
 */

export interface PrepayResult {
  codeUrl?: string;
  offSiteUrl?: string;
  payment?: PaymentName;
  paymentUrl?: string;
}
export const pay = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // data ready
  const {
    body: { order },
    user: { id: userId },
  } = request;

  try {
    const data: PrepayResult = {};
    //如果支付方法是微信支付
    if (order.payment === PaymentName.wxpay) {
      const wxpayResult = await wxpay(order, request);
      data.codeUrl = wxpayResult.code_url;
      data.payment = PaymentName.wxpay;

      await createdOrderLog({
        userId,
        orderId: order.id,
        action: OrderLogAction.orderUpdated,
        meta: JSON.stringify(wxpayResult),
      });
    }
    //如果支付方法是alipay
    if (order.payment === PaymentName.alipay) {
      const alipayResult = await alipay(order, request);

      data.codeUrl = alipayResult.paymentUrl;
      data.payment = PaymentName.alipay;
      data.offSiteUrl = alipayResult.pagePayRequestUrl;

      await createdOrderLog({
        userId,
        orderId: order.id,
        action: OrderLogAction.orderUpdated,
        meta: JSON.stringify(alipayResult),
      });
    }

    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { filter, pagination } = request;

  try {
    const orders = await getOrders({
      filter,
      pagination,
    });

    const ordersCount = await countOrders({
      filter,
    });

    // 设置响应头部
    response.header('X-Total-Count', ordersCount.count);

    // 作出响应
    response.send({ orders, ordersCount });
  } catch (error) {
    next(error);
  }
};

/**
 * 订单许可项目
 */
export const licenseItem = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { orderId } = request.params;

  try {
    const item = await getOrderLicenseItem(parseInt(orderId, 10));
    response.send(item);
  } catch (error) {
    next(error);
  }
};

/**
 * 订单订阅项目
 */
export const subscriptionItem = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { type } = request.query;

  try {
    const item = await getOrderSubscriptionItem(`${type}`);
    response.send(item);
  } catch (error) {
    next(error);
  }
};
