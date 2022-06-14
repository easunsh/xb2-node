import { Request,Response,NextFunction } from 'express';


//中间件练习，获得请求地址，
export const requestUrl = (
    request:　Request,
    response: Response,
    next: NextFunction
) => {
    console.log( request.url);
    next();
};


//默认异常处理器
export const defaultErrorHandler = (
    error:any,
    request:　Request,
    response: Response,
    next: NextFunction
) => {
    
    if(error.message){  //控制台输出一下错误信息
        console.log('发生了错误，请注意--->', error.message);
    }

   let statusCode: number, message: string;

   //处理异常
   switch ( error.message ){
        case 'NAME_IS_REQUIRED':
            statusCode = 400;
            message = '请提供用户名';
            break;
        case 'PASSWORD_IS_REQUIRED':
            statusCode = 400;
            message = '请提供密码';
            break;
        case 'USER_ALREADY_EXIST':
            statusCode = 409;  //有冲突
            message = '用户名已经存在';
            break;
       default:
           statusCode = 500;
           message = '服务器出了点问题';
           break;
   }
   //先设置响应状态码 
   response.status(statusCode).send({message});
};