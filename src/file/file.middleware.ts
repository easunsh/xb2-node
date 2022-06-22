import { Request,Response,NextFunction } from 'express';
import multer from 'multer';

/**
 * 创建一个Multer
 *  dest: 上传文件需要存储的位置
 * 
 */
const fileUpload = multer({

    dest: 'uploads/',

});

/**
 * 文件拦截器
 * single是处理单个文件的上传
 * 客户端上传的时候，表单名字设置成file
 */
export const fileInterceptor = fileUpload.single('file');