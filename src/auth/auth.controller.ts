import { Request,Response,NextFunction } from 'express';
import { signToken } from './auth.service'; 

/**
 * 用户登录
 */

 export const login = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {

      //准备数据 ，请求主体request的 USER
     const { 
      user: { id,name } ,
    } = request.body;

    //添加一个payload ，一个对象，里面用户的ID 和 NAME
    const payload = { id ,name} ;

    try {
      //签发令牌
      const token = signToken( { payload } );

      //做出响应
      response.send({ id,name,token });
    } catch(error) {

        next(error);

    }



      //准备需要存储的数据 ，从请求的主体json中解构出来，
      //const { name ,password } = request.body;

       //做出响应
       //response.send({ message: `欢迎回来, ${name}`});

  };