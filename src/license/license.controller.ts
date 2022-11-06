import { Request, Response, NextFunction } from 'express';
import { ResourceType } from '../app/app.enum';
import {
  getLicenses,
  getLicensesTotalCount,
  getUserValidLicense,
} from './license.service';

/**
 * 获取有效许可
 */
export const validLicense = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user: { id: userId },
    query: { resourceType, resourceId },
  } = request;

  try {
    const data = await getUserValidLicense(
      userId,
      resourceType as ResourceType,
      parseInt(`${resourceId}`, 10),
    );

    //做出相应
    response.send(data);
  } catch (error) {
    next(error);
  }

  next();
};

/**
 * 许可证列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user: { id: userId },
    pagination,
  } = request;

  //过滤器
  const filters = {
    user: userId,
  };

  try {
    const licenses = await getLicenses({
      filters,
      pagination,
    });
    const totalCount = await getLicensesTotalCount({ filters });

    //设置响应头部
    response.header('X-Total-Count', totalCount);

    //做出响应
    response.send(licenses);
  } catch (error) {
    next(error);
  }
};
