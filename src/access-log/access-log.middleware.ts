import { Request, Response, NextFunction } from 'express';
import { createAccessLog } from './access-log.service';
import _ from 'lodash';

/**
 * 访问日志
 */
interface AccessLogOptions {
  action: string;
  resourceType?: string;
  resourceParamName?: string;
  payloadParam?: string;
}

//middleware执行函数返回一个中间件，
export const accessLog = (options: AccessLogOptions) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //解构选项
  const {
    action,
    resourceType,
    resourceParamName = null,
    payloadParam = null,
  } = options;

  let payload = null;

  if (payloadParam) {
    //用lodash 提取request对象中的 payloadParam, 默认值是null
    payload = _.get(request, payloadParam, null);
  }

  //当前用户
  const { id: userId, name: userName } = request.user;

  //资源id,request.params[postId] 请求地址栏里的params ,
  const resourceId = resourceParamName
    ? parseInt(request.params[resourceParamName], 10)
    : null;

  //请求的头部数据
  const {
    referer,
    origin,
    'user-agent': agent,
    'access-language': language,
  } = request.headers;

  //请求里的其他属性
  const {
    ip,
    originalUrl,
    method,
    query,
    params,
    route: { path },
  } = request;

  //日志数据
  const accessLog = {
    userId,
    userName,
    action,
    resourceType,
    resourceId,
    payload,
    ip,
    origin,
    agent,
    language,
    originalUrl,
    method,
    query: Object.keys(query).length ? JSON.stringify(query) : null,
    params: Object.keys(params).length ? JSON.stringify(params) : null,
    path,
  };

  //创建日志
  createAccessLog(accessLog);

  //下一步
  next();
};
