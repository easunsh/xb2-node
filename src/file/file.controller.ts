import { Request,Response,NextFunction } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';

/**
 * 上传文件
 */
export const store = async (
    request:　Request,      
    response: Response,
    next: NextFunction
  ) => {
    
    //解构出request.user中的ID 重命名为uerid
    const { id: userId }  = request.user;

    //所属内容  request.query为所有的地址查询符
     const { post: postId } = request.query;
 
    /**
     * 用lodash中的pick ，从request.file中挑选几个属性组成新的对象
     */
    const fileInfo = _.pick( request.file,[
      'originalname',
      'mimetype',
      'filename',
      'size'
    ]);

    /**
     * 保存文件信息
     */

    try {

      const data = await createFile({
        ...fileInfo,
        userId,
        postId: parseInt(`${postId}`, 10)
      });

        //做出响应
    response.sendStatus(201).send(data);


    } catch( error ){

      next (error);
      
    }
  

  
 };


 /**
  * 查看文件服务
  */
 export const serve = async (
     request:　Request,
     response: Response,
     next: NextFunction
   ) => {
     //从地址参数中取得文件ID
     const { fileId } = request.params;

     try {

      //查找文件信息
      const file = await findFileById ( parseInt(fileId , 10));

      //做出响应
      response.sendFile(file.filename , {
        root: 'uploads',
        headers: {
          'Content-Type': file.mimetype,
        },

      } );
     } catch (error) {

        next(error);
     }

  };

