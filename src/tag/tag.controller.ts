//引入所需要的类型
import { Request,Response,NextFunction } from 'express';
import { createTag , getTabByName } from './tag.service';

/**
 * 创建标签TAG
 */
export const store = async (
    request:　Request,
    response: Response,
    next: NextFunction
  ) => {
    //准备数据
    const { name } = request.body;


    try {

         //判断标签是否在数据库中存在
        const tag = await getTabByName( name );
        
        //如果存在就报错
        if ( tag ) throw new Error('TAG_ALREADY_EXISTS');

        //如果不存在就创建
        const data = await createTag( { name } );
        
        //做出响应
        response.status(201).send( data );

    } catch (error) {
        next(error);
    }

 };