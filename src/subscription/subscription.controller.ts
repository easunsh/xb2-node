import { Request, Response, NextFunction } from 'express';
import { SubscriptionLogModel } from '../subscription-log/subscription-log.model';
import {
  getSubscriptionHistory,
  getUserValidSubscription,
} from './subscription.service';
import dayjs from 'dayjs';
import { countDownloads } from '../download/download.service';
import { SubscriptionType } from './subscription.model';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';

/**
 * 验证有效订阅
 */

export interface ValidSubscription extends SubscriptionLogModel {
  isExpired: boolean;
  daysRemaining: number;
  weeklyDownloads: number;
  weeklyDownloadsLimit: number;
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

      const { count } = await countDownloads({
        userId,
        type: 'subscription',
        datetime: '7-day',
      });

      validSubscription.weeklyDownloads = count;

      if (subscription.type === SubscriptionType.standard) {
        validSubscription.weeklyDownloadsLimit = STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK;
      } else {
        validSubscription.weeklyDownloadsLimit = null;
      }
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
