import { Request, Response, NextFunction } from 'express';
import { LicenseStatus } from '../license/license.model';
import { createLicense } from '../license/license.service';
import { ProductType } from '../product/product.model';
import { OrderLogAction } from '../order-log/order-log.model';
import { createdOrderLog } from '../order-log/order-log.service';
import { createOrder, updateOrder } from './order.service';
import { processSubscription } from '../subscription/subscription.service';

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
        //创建订单日志
        await createdOrderLog({
          userId,
          orderId,
          action: OrderLogAction.orderUpdate,
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
      action: OrderLogAction.orderUpdate,
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
