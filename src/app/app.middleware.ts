import { Request, Response, NextFunction } from 'express';

//中间件练习，获得请求地址，
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(request.url);
  next();
};

//默认异常处理器
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.message) {
    //控制台输出一下错误信息
    console.log('发生了错误，请注意--->', error.message);
  }

  let statusCode: number, message: string;

  //处理异常
  switch (error.message) {
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = '请提供用户名';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '请提供密码';
      break;
    case 'USER_ALREADY_EXIST':
      statusCode = 409; //有冲突
      message = '用户名已经存在';
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 400;
      message = '用户不存在';
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 400;
      message = '密码不匹配请检查';
      break;
    case 'USER_DOSE_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = '您不能处理这个内容';
      break;

    case 'UNAUTHORIZED':
      statusCode = 401;
      message = '请先登录';
      break;

    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = '文件不存在';
      break;

    case 'TAG_ALREADY_EXISTS':
      statusCode = 400;
      message = '标签已经存在';
      break;

    case 'POST_ALREADY_HAS_THIS_TAG':
      statusCode = 400;
      message = '内容已经关联此标签';
      break;
    case 'UNABLE_TO_REPLY_THIS_COMMENT':
      statusCode = 400;
      message = '无法回复了';
      break;

    case 'FILE_TYPE_NOT_ACCEPT':
      statusCode = 400;
      message = '文件上传格式不被支持';
      break;
    case 'POSTS_NOT_FOUND':
      statusCode = 404;
      message = '没找到相关内容';
      break;

    case 'USER_NOT_FOUND':
      statusCode = 404;
      message = '用户没找到';
      break;
    case 'PASSWORD_IS_THE_SAME':
      statusCode = 400;
      message = '新旧密码不能相同';
      break;
    case 'BAD_REQUEST':
      statusCode = 400;
      message = '无法处您的请求';
    case 'FORBIDDEN':
      statusCode = 403;
      message = '没有权限访问';
      break;

    default:
      statusCode = 500;
      message = '服务器出了点问题';
      break;
  }
  //先设置响应状态码
  response.status(statusCode).send({ message });
};
