//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import { getPayments } from './payment.service';

/**
 *支付方法
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const payments = await getPayments();
    response.send(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知，微信支付
 */
export const wxpayNotify = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //1.处理通知数据
    //2.验证通知数据
    //3.处理完成付款
    //4.做出响应
    response.send('收到');
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知，支付宝
 */
export const alipayNotify = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //1.处理通知数据
    //2.验证通知数据
    //3.处理完成付款
    //4.做出响应
    response.send('收到');
  } catch (error) {
    next(error);
  }
};
