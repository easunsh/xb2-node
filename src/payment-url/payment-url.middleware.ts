import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { getPaymentUrlByToken, updatePaymentUrl } from './payment-url.service';
import { DATE_TIME_FORMAT } from '../app/app.config';

/**
 * payment url Guard
 */
export const paymentUrlGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    query: { token },
  } = request;

  try {
    //check token
    if (!token) throw new Error('BAD_REQUEST');

    //check the payment url is enable
    const paymentUrl = await getPaymentUrlByToken(`${token}`);

    const isValidPaymentUrl = paymentUrl && !paymentUrl.used;

    if (!isValidPaymentUrl) throw new Error('BAD_REQUEST');

    //检查支付地址是否过期
    const isExpired = dayjs()
      .subtract(2, 'hours')
      .isAfter(paymentUrl.created);

    if (isExpired) throw new Error('PAYMENT_EXPIRED');

    //更新支付地址，标记为已经访问
    await updatePaymentUrl(paymentUrl.id, {
      used: dayjs().format(DATE_TIME_FORMAT),
    });

    //设置请求
    request.body = { paymentUrl };
  } catch (error) {
    return next(error);
  }

  //next
  next();
};
