//引入所需要的类型
import { Request,Response,NextFunction } from 'express';


/**
 * 排序方式sort
 */
export const sort = async (
    request:　Request,
    response: Response, 
    next: NextFunction
  ) => {
    //解构获取客户端的排序方式
    const { sort }  = request.query;
    //排序用的sql order 关键词
    let sqlSort: string;
    
    //设置排序用的sql
    switch ( sort ) {
        case 'early':
            sqlSort = 'post.id ASC';
            break;
        case 'last':
            sqlSort = 'post.id DESC';
            break;
        case 'most_comments':
            sqlSort = 'totalComments DESC , post.id DESC';
            break;
        default:
            sqlSort = 'post.id DESC';
            break;
 
    }


    //在请求中添加排序
    request.sort = sqlSort;
    console.log(request.sort);

    //下一步
    next();

 };


 /**filter
  * 过滤内容列表用的
  * 更具地址栏传过来的参数
  */
 export const filter = async (
     request:　Request,
     response: Response,
     next: NextFunction
   ) => {
    //解构查询符
     const { tag , user , action } = request.query;

     //设置默认的过滤
     request.filter = {

        name: 'default',
        sql: 'post.id IS NOT NULL',
     }


     // 按标签名过滤
     if ( tag && !user && !action) {

        request.filter = {
            name: 'tagName',
            sql: 'tag.name = ?',
            param: `${tag}`

        }

     }


      // 过滤用户发布的内容 user 是客户端通过查询符设置的用户id
      if ( user && action == 'published' && !tag) {
        
        request.filter = {
            name: 'userPublished',
            sql: 'user.id = ?',
            param: `${user}`,

        }

     }


     //下一步
     next();

  };