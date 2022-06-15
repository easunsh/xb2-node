import { Request,Response,NextFunction } from 'express';

/**
 * 用户登录
 */

 export const login = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {
      //准备需要存储的数据 ，从请求的主体json中解构出来，
      const { name ,password } = request.body;

       //做出响应
       response.send({ message: `欢迎回来, ${name}`});

  };