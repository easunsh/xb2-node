//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import { getPorductByType } from './product.service';

/**
 *获取许可产品
 */
export const showLicenseProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const licenseProduct = await getPorductByType('license');
    response.send(licenseProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * 获得订阅产品
 */
export const showSubscriptionProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = [];
    const standardSubscriptionProduct = await getPorductByType('subscription', {
      meta: {
        subscriptionType: 'standard',
      },
    });

    if (standardSubscriptionProduct) {
      data.push(standardSubscriptionProduct);
    }

    const proSubscriptionProduct = await getPorductByType('subscription', {
      meta: {
        subscriptionType: 'pro',
      },
    });

    if (proSubscriptionProduct) {
      data.push(proSubscriptionProduct);
    }

    response.send(data);
  } catch (error) {
    next(error);
  }
};
