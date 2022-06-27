//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { parse } from 'path';
import { createComment , isReplyComment, updateComment } from './comment.service';

/**
 * 发表评论
 */
export const store = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {
    
    //准备数据
    //当前登录中的用户,先使用authCuard 后面request能得到user
    const { id: userId } = request.user;  
    const { content , postId } = request.body;

    //简化写法
    const comment = {
        content,
        postId,
        userId
    }

    try {
        //保存数据
        const data = await createComment( comment );
        
        //做出响应
        response.status(201).send(data);
    } catch (error) {
        next(error);
    }

 };


 /**
  * 回复评论功能
  * 目前就是一级评论，不允许多次回复，数据库 parentId 有值，就无法再回复
  */
 export const reply = async (
     request:　Request,
     response: Response,
     next: NextFunction
   ) => {
    //准备数据 commentId的值，就是要去回复的那条评论的id
    const { commentId } = request.params;
    const parentId = parseInt( commentId , 10 );
    const { id: userId } = request.user;
    const { content , postId } = request.body;

    const comment = {

        content,
        postId,
        userId,
        parentId

    }

    try {
        //检查评论是否为回复评论
        const reply = await isReplyComment( parentId );

        if(reply) return next( new Error('UNABLE_TO_REPLY_THIS_COMMENT') );

        
    } catch (error) {
        return next( error );
    }


    try {

        //回复评论
        const data = await createComment( comment );
        //做出响应
        response.status(201).send(data);

    } catch (error) {
        next(error);
    }

     
  };

  /**
   * 修改评论
   */
  export const update = async (
      request:　Request,
      response: Response,
      next: NextFunction
    ) => {
      //准备数据
      const { commentId } = request.params;
      const { content } = request.body;

      const comment = {
            id: parseInt( commentId , 10),
            content,
      };

      try {
        //修改评论
        const data = await updateComment( comment );
        //响应
        response.send(data);

      } catch (error) {
        next(error);
      }
   };   