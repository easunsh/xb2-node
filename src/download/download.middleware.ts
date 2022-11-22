//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { getPostById, PostStatus } from '../post/post.service';
import { getUserValidLicense } from '../license/license.service';
import { getUserValidSubscription } from '../subscription/subscription.service';
import { SubscriptionType } from '../subscription/subscription.model';
import { countDownloads } from './download.service';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';

/**
 * 下载守卫
 */
export const downloadGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    body: { resourceType, resourceId },
    user: { id: userId },
  } = request;

  try {
    //检查资源
    const resource = await getPostById(resourceId, {
      currentUser: { id: userId },
    });

    const isValidResource =
      resource && resource.status === PostStatus.published;

    if (!isValidResource) throw new Error('BAD_REQUEST');

    //调取资源许可
    const license = await getUserValidLicense(userId, resourceType, resourceId);

    if (license) {
      request.body.license = license;
    }

    //调取用户订阅
    const subscription = await getUserValidSubscription(userId);

    //有效订阅
    const isValidSubscription =
      subscription && dayjs().isBefore(subscription.expired);

    //检查用户许可与订阅
    if (!license && !isValidSubscription) throw new Error('FORBIDDEN');

    /**
     * 检查标准订阅下载限制
     * 判断的意思，如果用户拥有有效订阅，同时对资源没有许可，并且订阅类型是标准订阅
     * 就可以去统计一下用户的下载次数
     */

    if (
      isValidSubscription &&
      !license &&
      subscription.type === SubscriptionType.standard
    ) {
      const { count } = await countDownloads({
        userId,
        type: 'subscription',
        datetime: '7-day',
      });

      //如果下载次数大于规定的每周订阅的下载次数
      if (count >= STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK) {
        throw new Error('DOWNLOAD_LIMIT_REACHED');
      }
    }
  } catch (error) {
    return next(error);
  }

  //下一步
  next();
};
