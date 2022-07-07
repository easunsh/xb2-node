//引入所需要的类型
import { Request,Response,NextFunction } from 'express';

/**
 * URL 过滤器
 */
export const filter = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {

    //解构查询符
    const { post ,user , action } = request.query;

    //默认的过滤
    request.filter = {
        name: 'default',
        sql: 'comment.parentId IS NULL',
    };

    //内容的评论 SQL WHERE 条件
    if ( post && !user && !action){

        request.filter = {

            name:'postComments',
            sql: 'comment.parentId IS NULL AND comment.postId = ?',
            param: `${post}`,
        }

    }

    //用户发表的评论,不包含回复
    if( user && action == 'published' && !post ){

        request.filter = {
            name: 'userPublished',
            sql: 'comment.parentId is NULL AND comment.userId = ?',
            param:  `${user}`,

        };

    }


    //过滤用户的回复内容
    if( user && action == 'replied' && !post ){

        request.filter = {
            name: 'userReplied',
            sql: 'comment.parentId is NOT NULL AND comment.userId = ?',
            param:  `${user}`,

        };

    }


    //下一步
    next();
    
 };