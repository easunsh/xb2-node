//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { getPosts,createPost } from './post.service'; 

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

        //创建内容
        try {

          //将需要存储的内容交给函数
          const data = await createPost( { title, content } );
          //做出一个响应
          response.status(201).send(data);

        }catch (error) {

          next (error);
        }

    };

