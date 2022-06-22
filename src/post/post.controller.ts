//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { getPosts,createPost, updatePost, deletePost } from './post.service'; 
//导入LODASH
import _ from 'lodash';

//内容列表
export const index = async (   //标记异步
    request:　Request,
    response: Response,
    next: NextFunction
) => {

  
    try {

      //加入await，去等待一个执行的结果
      const posts = await getPosts();
      response.send(posts);


    } catch ( error ) {

       //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
      next(error); 


    }
  

    //console.log(request.headers);
      //模拟一下错误
    //   if ( request.headers.authorization !== 'SECRET' ) {

    //     return next ( new Error() );  //return 不然会一直执行下去

    // }

    
};



    /***
     * 
     * 创建内容 保存入库
     * 
     */

export const store = async (
      request:　Request,
      response: Response,
      next: NextFunction
    ) => {
        //准备需要存储的数据 ，从请求的主体json中解构出来，
        const { title ,content } = request.body;

        //解构扩展出来的request.user 里的ID ，重命名为userid
        const { id: userId } = request.user;

        //创建内容
        try {

          //将需要存储的内容交给函数
          const data = await createPost( { title, content, userId } );
          //做出一个响应
          response.status(201).send(data);

        }catch (error) {
 //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
          next (error);
        }

    };

    /**
     * 更新内容的接口
     */
export const update = async(
  request:　Request,
  response: Response,
  next: NextFunction

) => {

  //获取需要更新内容的ID
  const { postId} = request.params; //所有的请求地址参数

  //准备要更新的数据 更新title 会给CONTENT赋值NULL  会用LODASH改造
  //const { title, content } = request.body;
  const post = _.pick(request.body, ['title','content']);

  //执行更新
  try {

    //const data = await updatePost( parseInt( postId , 10 ) ,{ title , content });
     const data = await updatePost( parseInt( postId , 10 ) , post);
    response.send(data);

  } catch (error) {
     //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
      next( error );
  }

};


/**
 * 删除内容
 */
export const destroy = async (
  request:　Request,
  response: Response,
  next: NextFunction

) => {

  //获取请求地址的内容ID
  const { postId } = request.params;

  //删除内容
  try {

    const data = await deletePost( parseInt( postId,10) );
    response.send( data );

  } catch (error) {
 //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
    next(error);
    

  }
  
};
