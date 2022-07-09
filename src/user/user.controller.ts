//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
//import { UserModel } from './user.model';
import * as userService from './user.service';
import _ from 'lodash';

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

/**
 * 显示用户账户
 */
export const show = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {
    //准备数据
    const { userId } = request.params;

    //调取用户
    try {

      const user = await userService.getUserById( parseInt( userId,10 ) );

      if( !user ){
        return next( new Error('USER_NOT_FOUND') );
      }

      //做出响应
      response.send( user );


    } catch (error) {
      next( error );
    }
 };


 /**
  * 更新用户数据
  */
 export const update = async (
     request:　Request,
     response: Response,
     next: NextFunction
   ) => {

    //data ready
    const { id } = request.user;

    //选择需要的数据组合给userData
    const userData = _.pick( request.body.update, ['name','password'] );

    //更新用户
    try {
      const data = await userService.updateUser( id , userData );

      //response
      response.send(data);


    } catch(error){

      next( error );
    }

     
  };
