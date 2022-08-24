import { Request, Response, NextFunction } from 'express';
import {
  searchCameras,
  searchTags,
  searchUsers,
  searchLens,
} from './search.service';

/**
 * 搜索标签
 */
export const tags = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //准备关键字
    const { name } = request.query;

    //查询标签
    const tags = await searchTags({ name: `${name}` });

    //做出响应
    response.send(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索用户名
 */
export const users = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //准备关键字
    const { name } = request.query;

    //查询标签
    const users = await searchUsers({ name: `${name}` });

    //做出响应
    response.send(users);
  } catch (error) {
    next(error);
  }
};

/**
 * 查询相机
 */
export const cameras = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { makeModel } = request.query;
    const cameras = await searchCameras({ makeModel: `${makeModel}` });
    response.send(cameras);
  } catch (error) {
    next(error);
  }
};

/**
 * 查询镜头
 */
export const lens = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { makeModel } = request.query;
    const lens = await searchLens({ makeModel: `${makeModel}` });
    response.send(lens);
  } catch (error) {
    next(error);
  }
};
