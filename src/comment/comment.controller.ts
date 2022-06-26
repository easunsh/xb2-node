//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { createComment } from './comment.service';

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