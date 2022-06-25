import { Request,Response,NextFunction } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';
import path from 'path';
import fs from 'fs';  //nodejs 自带的FS

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
        postId: parseInt(`${postId}`, 10),
        ...request.fileMetaData
      });

        //做出响应
        response.status(201).send(data);


    } catch( error ){

      next (error);
      
    }
  

  
 };


 /**
  * 1查看文件服务 
  * 2根据传入图片尺寸返回图片
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
      const file = await findFileById ( parseInt( fileId , 10 ));

      /**如果
       * 要提供不同尺寸的图片
       * 解构出size
       */
      const { size } = request.query;

      /**
       * 文件名与目录
       */
      let filename = file.filename;
      let root = 'uploads';
      let resized = 'resized';

      /**
       * 是否地址栏传入具体的SIZE条件
       * 如果有要求SIZE,重新组织一下，
       */
      if ( size ){

          const imageSizes = ['large' , 'medium' , 'thumbnail'];
          
          //检查传入文件尺寸是否可用 返回true 或 false
          if( !imageSizes.some( item => item ==size) ){
            throw new Error('FILE_NOT_FOUND');
          }

          /**
           * 检查要提供的文件是否存在
           * 同步的检查文件是否存在
           * 传入文件的路径
           */

          const fileExist = fs.existsSync(
            path.join( root , resized , `${filename}-${size}`)
          );

          /**
           * 如果文件存在
           * 组织需要传给客户端的文件名与目录
           * 如果文件存在，重新设置filename的值
           */
          if( fileExist ){
            filename = `${filename}-${size}`;
            root = path.join( root , resized );
          }
      }

      //做出响应
      response.sendFile(filename , {
        root,  //相当于 root: root,
        headers: {
          'Content-Type': file.mimetype,
        },

      } );
     } catch (error) {

        next(error);
     }

  };


  /**
   * 用户调用读取文件信息接口
   */
  export const metadata = async (
      request:　Request,
      response: Response,
      next: NextFunction
    ) => {
      //文件的id
      const { fileId } = request.params;

      try {
        //查询文件数据
        const file = await findFileById( parseInt( fileId , 10 ));

        //准备响应数据 , 重新组织一下
        const data = _.pick( file , ['id','size','width','height','metadata'] );
        //做出响应
        response.send(data);

      } catch (error) {
          next(error);
      }
   };

