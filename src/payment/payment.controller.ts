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
