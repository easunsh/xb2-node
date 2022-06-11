//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { getPosts } from './post.service'; 

//内容列表
export const index = (
    request:　Request,
    response: Response,
    next: NextFunction
) => {

    console.log(request.headers);

    //模拟一下错误
    if ( request.headers.authorization !== 'SECRET' ) {

        return next ( new Error() );  //return 不然会一直执行下去

    }

    const posts = getPosts();
    response.send(posts);
};
