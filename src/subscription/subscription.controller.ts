import { Request, Response, NextFunction } from 'express';
import { SubscriptionLogModel } from '../subscription-log/subscription-log.model';
import {
  getSubscriptionHistory,
  getUserValidSubscription,
} from './subscription.service';
import dayjs from 'dayjs';

/**
 * 验证有效订阅
 */

export interface ValidSubscription extends SubscriptionLogModel {
  isExpired: boolean;
  daysRemaining: number;
}
export const validSubscription = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user: { id: userId },
  } = request;

  try {
    const subscription = await getUserValidSubscription(userId);

    const validSubscription = subscription
      ? (subscription as ValidSubscription)
      : null;

    if (subscription) {
      validSubscription.isExpired = dayjs().isAfter(subscription.expired);
      validSubscription.daysRemaining = validSubscription.isExpired
        ? 0
        : dayjs(subscription.expired).diff(dayjs(), 'days');
    }

    //做出响应
    response.send(validSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * 订阅历史
 */
export const history = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { subscriptionId } = request.params;

  try {
    const history = await getSubscriptionHistory(parseInt(subscriptionId, 10));
    response.send(history);
  } catch (error) {
    next(error);
  }
};
