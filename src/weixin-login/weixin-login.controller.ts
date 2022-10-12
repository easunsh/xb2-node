import { Request, Response, NextFunction } from 'express';
import { updateUserMeta } from '../user-meta/user-meta.service';
import { socketIoServer } from '../app/app.server';
import { weixinLoginPostProcess } from './weixin-login.service';
import { signToken } from '../auth/auth.service';
import { UserData } from 'src/user/user.service';
/**
 * 微信登录：用户授权扫码后重定向到应用页面
 */
export const weixinLoginCallback = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    query: { state: socketId },
    body: { user, userMeta, weixinUserInfo },
  } = request;

  try {
    //签发令牌
    const payload = { id: user.id, name: user.name };
    const token = signToken({ payload });

    //通知客户端登录成功
    socketIoServer
      .to(`${socketId}`)
      .emit('weixinLoginSucceeded', { user, token });
    //更新用户Meta
    await updateUserMeta(userMeta.id, {
      info: JSON.stringify(weixinUserInfo),
    });

    //后期处理
    await weixinLoginPostProcess({ user, weixinUserInfo });

    //做出响应
    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * 微信登录：关联本地账户
 */
export const weixinLoginConnect = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user,
    body: { weixinUserInfo },
  } = request;

  try {
    //签发令牌
    const token = signToken({
      payload: {
        id: user.id,
        name: user.name,
      },
    });

    //后期处理
    await weixinLoginPostProcess({
      user: user as UserData,
      weixinUserInfo,
    });

    //做出响应
    response.send({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 微信登录： 创建并关联本地账户
 */
export const weixinLoginCreateConnect = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    user,
    body: { weixinUserInfo },
  } = request;

  try {
    //签发令牌
    const token = signToken({
      payload: {
        id: user.id,
        name: user.name,
      },
    });

    //后期处理
    await weixinLoginPostProcess({
      user: user as UserData,
      weixinUserInfo,
    });
  } catch (error) {
    next(error);
  }
};
