import { Request, Response, NextFunction } from 'express';
import { UserMetaType } from '../user-meta/user-meta.model';
import { socketIoServer } from '../app/app.server';
import {
  createUserMeta,
  getUserMetaByWeixinUnionId,
} from '../user-meta/user-meta.service';
import { createUser, getUserById } from '../user/user.service';
import {
  getWeixinAccessToken,
  getWeixinUserInfo,
} from './weixin-login.service';

/**
 * 微信登录守卫
 */
export const weixinLoginGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { code, state: socketId } = request.query;

  if (!(code && socketId)) return next(new Error('BAD_REQUEST'));

  try {
    //微信访问令牌
    const { access_token, openid, unionid } = await getWeixinAccessToken(
      `${code}`,
    );

    //微信用户信息
    const weixinUserInfo = await getWeixinUserInfo({ access_token, openid });
    //检查是否绑定
    const userMeta = await getUserMetaByWeixinUnionId(unionid);

    if (userMeta) {
      const user = await getUserById(userMeta.userId);
      request.user = user;

      request.body = {
        user,
        weixinUserInfo,
        userMeta,
      };
    } else {
      //通知微信用户需要绑定账户
      socketIoServer
        .to(`${socketId}`)
        .emit('weixinLoginConnect', weixinUserInfo);
      return next(new Error('CONNECT_ACCOUNT_REQUIRED'));
    }
  } catch (error) {
    return next(error);
  }
  //下一步
  next();
};

/**
 * 微信登录关联器
 */
export interface WeixinLoginConnectorOptions {
  isCreateUserRequired: boolean;
}
export const weixinLoginConnector = (
  options: WeixinLoginConnectorOptions = { isCreateUserRequired: false },
) => async (request: Request, response: Response, next: NextFunction) => {
  //解构选项
  const { isCreateUserRequired } = options;

  //主体数据
  const { weixinUserInfo } = request.body;

  //请求用户
  let { user = null } = request;

  try {
    //检查是否绑定过,
    const { unionid } = weixinUserInfo;
    const userMeta = await getUserMetaByWeixinUnionId(unionid);

    //如果已经绑定
    if (userMeta) return next(new Error('WEIXIN_ACCOUNT_ALREADY_CONNECTED'));
    //如果没有注册过,就创建
    if (isCreateUserRequired) {
      const { name, password } = request.body;
      const data = await createUser({ name, password });

      //获得刚注册的用户
      user = await getUserById(data.insertId);
      //设置请求用户
      request.user = user;
    }

    //关联账户
    await createUserMeta({
      userId: user.id,
      type: UserMetaType.weixinUserInfo,
      info: JSON.stringify(weixinUserInfo),
    });
  } catch (error) {
    return next(error);
  }

  //下一步
  next();
};
