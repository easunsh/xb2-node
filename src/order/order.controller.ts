import { Request, Response, NextFunction } from 'express';
import { OrderLogAction } from '../order-log/order-log.model';
import { createdOrderLog } from '../order-log/order-log.service';
import { createOrder, updateOrder } from './order.service';

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
    user,
    body: { order, resourceType, resourceId },
  } = request;

  try {
    //创建订单
    const data = await createOrder(order);

    //创建订单日志
    await createdOrderLog({
      userId: user.id,
      orderId: order.insertId,
      action: OrderLogAction.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });
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
