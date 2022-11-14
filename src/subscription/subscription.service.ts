import dayjs from 'dayjs';
import { OrderModel } from '../order/order.model';
import { ProductModel } from '../product/product.model';
import { connection } from '../app/database/mysql';
import {
  SubscriptionModel,
  SubscriptionStatus,
  SubscriptionType,
} from './subscription.model';
import { SubscriptionLogAction } from '../subscription-log/subscription-log.model';
import {
  createSubscriptionLog,
  getSubscriptionLogByOrderId,
} from '../subscription-log/subscription-log.service';
import { getProductByType } from '../product/product.service';
import { OrderLogModel } from '../order-log/order-log.model';
/**
 * 创建订单
 */
export const createSubscription = async (subscription: SubscriptionModel) => {
  //准备查询
  const statement = `
        INSERT INTO subscription
        SET ?
     `;
  //执行
  const [data] = await connection.promise().query(statement, subscription);
  //提供结果
  return data as any;
};

/**
 * 更新订阅
 */
export const updateSubscription = async (
  subscriptionId: number,
  subscription: SubscriptionModel,
) => {
  //准备查询
  const statement = `
    UPDATE subscription
    SET ?
    WHERE id = ?
     `;
  //执行
  const [data] = await connection
    .promise()
    .query(statement, [subscription, subscriptionId]);
  //提供结果
  return data as any;
};

/**
 * 调取用户有效订阅
 */
export const getUserValidSubscription = async (userId: number) => {
  //准备查询
  const statement = `
    SELECT
      *
    FROM
      subscription
    WHERE
     subscription.status = 'valid'
        AND userId = ?
     `;
  //执行
  const [data] = await connection.promise().query(statement, userId);
  //提供结果
  return data[0] as SubscriptionModel;
};

/**
 * 处理订阅
 */

export interface ProcessSubscriptionOptions {
  userId: number;
  order: OrderModel;
  product: ProductModel;
}
export const processSubscription = async (
  options: ProcessSubscriptionOptions,
) => {
  //解构选项
  const {
    userId,
    order,
    product: {
      meta: { subscriptionType },
    },
  } = options;

  //调取用户有效订阅
  const subscription = await getUserValidSubscription(userId);

  //订阅ID
  let subscriptionId = subscription ? subscription.id : null;

  //订阅日志动作
  let action: SubscriptionLogAction;

  //全新订阅
  if (!subscription) {
    const data = await createSubscription({
      userId,
      type: subscriptionType,
      status: SubscriptionStatus.pending,
    });

    action = SubscriptionLogAction.create;
    subscriptionId = data.insertId;
  } else {
    //检查订阅是否已经过期了
    //dayjs()调用就是默认当前的日期时间 用他的isAfter去比较
    //已经过期isExpired 为true
    const isExpired = dayjs().isAfter(subscription.expired);

    //未过期续订
    if (subscriptionType === subscription.type && !isExpired) {
      action = SubscriptionLogAction.renew;
    }

    //过期重订
    if (subscriptionType === subscription.type && isExpired) {
      action = SubscriptionLogAction.resubscribe;
    }

    //升级订阅
    if (
      subscriptionType === SubscriptionType.pro &&
      subscription.type === SubscriptionType.standard &&
      !isExpired
    ) {
      //计算出订阅剩余天数
      const daysRemaining = Math.abs(
        dayjs().diff(subscription.expired, 'days'),
      );
      //专业订阅产品
      const proSubscriptionProduct = await getProductByType('subscription', {
        meta: {
          subscriptionType: SubscriptionType.pro,
        },
      });

      //专业订阅金额
      const proAmount =
        (proSubscriptionProduct.salePrice / 365) * daysRemaining;

      //标准订阅产品
      const standardSubscriptionProduct = await getProductByType(
        'subscription',
        {
          meta: {
            subscriptionType: SubscriptionType.standard,
          },
        },
      );

      //剩余金额
      const leftAmount =
        (standardSubscriptionProduct.salePrice / 365) * daysRemaining;

      //升级应付金额
      order.totalAmount = parseFloat((proAmount - leftAmount).toFixed(2));

      //订阅日志动作
      action = SubscriptionLogAction.upgrade;
    }
  }

  //创建订阅日志
  await createSubscriptionLog({
    subscriptionId,
    userId,
    orderId: order.id,
    action,
    meta: JSON.stringify({
      subscriptionType,
      totalAmount: `${order.totalAmount}`,
    }),
  });

  //提供数据
  return action === SubscriptionLogAction.upgrade ? { order } : null;
};

/**
 * 按ID 调取订阅
 */
export const getSubscriptionById = async (subscriptionId: number) => {
  //准备查询
  const statement = `
   SELECT 
    *
   FROM
    subscription
   WHERE
    subscription.id = ?
    `;
  //执行
  const [data] = await connection.promise().query(statement, subscriptionId);
  //提供结果
  return data[0] as SubscriptionModel;
};

/**
 * 订阅处理，后续处理，比如用户付款后
 */

export interface postProcessSubscriptionOption {
  order: OrderLogModel;
  product: ProductModel;
}
export const postProcessSubscription = async (
  options: postProcessSubscriptionOption,
) => {
  //解构选项
  const {
    order: { id: orderId, userId },
    product: {
      meta: { subscriptionType },
    },
  } = options;

  //订阅日志
  const subscriptionLog = await getSubscriptionLogByOrderId(orderId);

  //找出订阅
  const subscription = await getSubscriptionById(
    subscriptionLog.subscriptionId,
  );

  //订阅日志动作
  let action: SubscriptionLogAction;

  //之前的订阅类型
  let preType = subscription.type;

  //订阅状态
  const status = SubscriptionStatus.valid;

  //日期时间格式
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  //新订阅
  if (subscription.status === SubscriptionStatus.pending) {
    subscription.expired = dayjs(Date.now())
      .add(1, 'year')
      .format(dateTimeFormat);

    action = SubscriptionLogAction.statusChanged;
    preType = null;
  }

  //续订
  if (
    subscriptionType === subscription.type &&
    subscriptionLog.action === SubscriptionLogAction.renew
  ) {
    subscription.expired = dayjs(subscription.expired)
      .add(1, 'year')
      .format(dateTimeFormat);

    action = SubscriptionLogAction.renewed;
  }

  //重订
  if (
    subscriptionType === subscription.type &&
    subscriptionLog.action === SubscriptionLogAction.resubscribe
  ) {
    subscription.expired = dayjs(Date.now())
      .add(1, 'year')
      .format(dateTimeFormat);

    action = SubscriptionLogAction.resubscribed;
  }

  //升级
  if (subscriptionLog.action === SubscriptionLogAction.upgrade) {
    action = SubscriptionLogAction.upgraded;
  }

  //更新订阅
  await updateSubscription(subscription.id, {
    type: subscriptionType,
    status,
    expired: subscription.expired,
  });

  //创建订阅日志
  await createSubscriptionLog({
    userId,
    subscriptionId: subscription.id,
    orderId,
    action,
    meta: JSON.stringify({
      status,
      expired: dayjs(subscription.expired).toISOString(),
      type: subscriptionType,
      preType,
    }),
  });
};

/**
 * 调取订阅历史
 */
export interface SubscriptionHistory {
  id?: number;
  action?: SubscriptionLogAction;
  meta?: any;
  created?: string;
  orderId?: number;
  totalAmount?: string;
}
export const getSubscriptionHistory = async (subscriptionId: number) => {
  //准备查询
  const statement = `
    SELECT
      log.id,
      log.action,
      log.meta,
      log.created,
      log.orderId,
      order.totalAmount
    FROM
      subscription
    LEFT JOIN subscription_log AS log
      ON subscription.id = log.subscriptionId
    LEFT JOIN \`order\`
      ON \`order\`.id = log.orderId
    WHERE
      order.status = 'completed'
      AND log.action IN ('create','renewed','upgraded','resubscribed')
      AND subscription.id = ?
      ORDER BY 
       log.id DESC
     `;
  //执行
  const [data] = await connection.promise().query(statement, subscriptionId);
  //提供结果
  return data as Array<SubscriptionHistory>;
};
