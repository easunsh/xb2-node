import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import bcrypt from 'bcrypt';
import _ from 'lodash';

/**
 * 验证用户数据的中间件
 */
export const validateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获得请求来的数据
  const { name, password } = request.body;
  //验证必填数据
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  //验证用户名是否存在
  const user = await userService.getUserByName(name);
  if (user) return next(new Error('USER_ALREADY_EXIST'));
  //下一步
  next();
};

/**
 * HASH 密码
 */
export const hashPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 解构
  const { password } = request.body;

  //HASH 密码 传入用户的密码，10为强度
  request.body.password = await bcrypt.hash(password, 10);
  //下一步
  next();
};

/**
 * 验证更新用户数据
 * 重置密码等
 */
export const validateUpdateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 validate 包含密码等
  //json 对象 validate是 先验证密码， update里是要更新的内容
  const { validate, update } = request.body;

  //当前用户 要先用 authCuard 才能获得
  const { id: userId } = request.user;

  try {
    //检查用户在请求主体中validate中是否提供了密码
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'));
    }

    //调取用户数据 password 为true 调取的用户会包含password
    const user = await userService.getUserById(userId, { password: true });

    //验证用户密码是否匹配  对比hasH处理过额
    const matched = await bcrypt.compare(validate.password, user.password);

    //如果不匹配
    if (!matched) {
      return next(new Error('PASSWORD_DOES_NOT_MATCH'));
    }

    //如果用户想要修改自己的用户名，判断新的用户名是否占用
    if (update.name) {
      const user = await userService.getUserByName(update.name);

      if (user) {
        return next(new Error('USER_ALREADY_EXIST'));
      }
    }

    //如用户想要更新自己的密码， 处理用户更新密码
    if (update.password) {
      //对比新旧密码是否相同
      const matched = await bcrypt.compare(update.password, user.password);

      if (matched) {
        return next(new Error('PASSWORD_IS_THE_SAME'));
      }

      //HASH 用户更新密码
      request.body.update.password = await bcrypt.hash(update.password, 10);
    }

    //下一步
    next();
  } catch (error) {
    return next(error);
  }
};
