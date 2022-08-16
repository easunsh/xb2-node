import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';

/**
 * 文件过滤器设置
 * 制造一个函数
 * 使用fileTypes做参数
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    //测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);

    if (allowed) {
      //允许上传
      callback(null, true);
    } else {
      console.log('FILE_TYPE_NOT_ACCEPT');
      //拒绝上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

//执行过滤器
const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个Multer
 *  dest: 上传文件需要存储的位置
 *
 */
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
});

/**
 * 文件拦截器
 * single是处理单个文件的上传
 * 客户端上传的时候，表单名字设置成file
 */
export const fileInterceptor = fileUpload.single('file');

/**
 * 文件处理器
 * 读取上传文件附加信息
 * 放在 router 中 fileInterceptor 后
 * 可以得到上传的文件的信息
 */
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { path } = request.file;
  let image: Jimp;

  try {
    //读取图像文件
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }

  //console.log(image);

  //准备需要的文件数据,解构IMAGE 中的
  const { imageSize, tags } = image['_exif'];

  //在请求中添加文件数据
  request.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags), //转换成json格式数据
  };

  //调整图像尺寸
  imageResizer(image, request.file);

  //下一步
  next();
};
