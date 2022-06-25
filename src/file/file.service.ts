import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';
import path from 'path';  //组织一个文件路径
import Jimp from 'jimp';

/**
 * 存储文件信息
 * 问号是占位符
 */
export const createFile = async (
   file: FileModel
  ) => {
    const statment = `
    INSERT INTO file
    SET ?
`;

//执行查询 函数接收的参数,是一个数据对象模型
const [data] = await connection.promise().query( statment , file );

//提供数据
return data;
 };


  /**
  * 按照ID查找文件
  */
   export const findFileById = async ( fileId: number ) => {
     //准备查询
   	//JSON_OBJECT 组织一个JSON对象 as 个名字user
	const statement = `
	SELECT * FROM file
    WHERE id = ?
	`;

	//用connection的方法，返回结果是个数组，
	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
	const [data]  = await connection.promise().query( statement,fileId );
	
	return data[0];

  };

  /**
   * 调整图像尺寸的功能
   */
  export const imageResizer = async (

     image: Jimp, file: Express.Multer.File

    ) => {

      //图像尺寸
      const { imageSize } = image['_exif'];

      /**
       * 文件路径
       * file.destination 存储文件的目录 如 upload
       * upload目录下的 resized 目录下
       * filename 文件的名字
       */
      const filePath = path.join( file.destination , 'resized', file.filename );

      /**
       * 处理大尺寸
       * quality 图像质量
       * write 将处理的结果写入文件 ，设置一个路径
       */
      if ( imageSize.width > 1280 ) {

        image
          .resize( 1280, Jimp.AUTO )
          .quality(85)
          .write(`${filePath}-large`);

      }


      /**
       * 处理中等尺寸
       */
       if ( imageSize.width > 640 ) {

        image
          .resize( 640, Jimp.AUTO )
          .quality(85)
          .write(`${filePath}-medium`);

      }

      /**
       * 处理缩略图
       */
       if ( imageSize.width > 320 ) {

        image
          .resize( 320, Jimp.AUTO )
          .quality(85)
          .write(`${filePath}-thumbnail`);

      }
      
   };