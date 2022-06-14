//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userService from './user.service';

  /***
     * 
     * 创建用户内容 保存入库
     * 
     */

   export const store = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {
      //准备需要存储的数据 ，从请求的主体json中解构出来，
      const { name ,password } = request.body;

      //创建内容
      try {

        //将需要存储的内容交给函数
        const data = await userService.createUser( { name, password } );
        //做出一个响应
        response.status(201).send(data);

      }catch (error) {
//这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
        next (error);
      }

  };