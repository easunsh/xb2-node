import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';
import path from 'path'; //组织一个文件路径
import Jimp from 'jimp';
import fs from 'fs';
import { TokenPayload } from '../auth/auth.interface';
import { getPostById, PostStatus } from '../post/post.service';
import { getAuditLogByResource } from '../audit-log/audit-log.service';
import { AuditLogStatus } from '../audit-log/audit-log.model';

/**
 * 存储文件信息
 * 问号是占位符
 */
export const createFile = async (file: FileModel) => {
  const statment = `
    INSERT INTO file
    SET ?
`;

  //执行查询 函数接收的参数,是一个数据对象模型
  const [data] = await connection.promise().query(statment, file);

  //提供数据
  return data;
};

/**
 * 按照ID查找文件
 */
export const findFileById = async (fileId: number) => {
  //准备查询
  //JSON_OBJECT 组织一个JSON对象 as 个名字user
  const statement = `
	SELECT * FROM file
    WHERE id = ?
	`;

  //用connection的方法，返回结果是个数组，
  //需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
  const [data] = await connection.promise().query(statement, fileId);

  return data[0];
};

/**
 * 调整图像尺寸的功能
 */
export const imageResizer = async (image: Jimp, file: Express.Multer.File) => {
  //图像尺寸
  const { imageSize } = image['_exif'];

  /**
   * 文件路径
   * file.destination 存储文件的目录 如 upload
   * upload目录下的 resized 目录下
   * filename 文件的名字
   */
  const filePath = path.join(file.destination, 'resized', file.filename);

  /**
   * 处理大尺寸
   * quality 图像质量
   * write 将处理的结果写入文件 ，设置一个路径
   */
  if (imageSize.width > 1280) {
    image
      .resize(1280, Jimp.AUTO)
      .quality(85)
      .write(`${filePath}-large`);
  }

  /**
   * 处理中等尺寸
   */
  if (imageSize.width > 640) {
    image
      .resize(640, Jimp.AUTO)
      .quality(85)
      .write(`${filePath}-medium`);
  }

  /**
   * 处理缩略图
   */
  if (imageSize.width > 320) {
    image
      .resize(320, Jimp.AUTO)
      .quality(85)
      .write(`${filePath}-thumbnail`);
  }
};

/**
 * 找出内容相关文件
 */
export const getPostFiles = async (postId: number) => {
  //准备查询
  const statement = `
      SELECT
        file.filename
      FROM
        file
      WHERE
        postId = ?
   `;
  //执行
  const [data] = await connection.promise().query(statement, postId);
  //提供结果
  return data as any;
};

/**
 * 删除内容文件
 */
export const deletePostFiles = async (files: Array<FileModel>) => {
  const uploads = 'uploads';
  const resized = [uploads, 'resized'];

  files.map(file => {
    const filesToDelete = [
      [uploads, file.filename],
      [...resized, `${file.filename}-thumbnail`],
      [...resized, `${file.filename}-medium`],
      [...resized, `${file.filename}-large`],
    ];
    filesToDelete.map(item => {
      const filePath = path.join(...item);
      fs.stat(filePath, (error, stats) => {
        if (stats) {
          fs.unlink(filePath, error => {
            if (error) throw error;
          });
        }
      });
    });
  });
};

/**
 * 检查文件权限
 */
interface FileAccessControlOptions {
  file: FileModel;
  currentUser: TokenPayload;
}

export const fileAccessControl = async (options: FileAccessControlOptions) => {
  const { file, currentUser } = options;
  const ownFile = file.userId === currentUser.id;

  //看一下与这个文件相关的post是否有审核日志，以及审核日志的状态
  const [parentPostAuditLog] = await getAuditLogByResource({
    resourceId: file.postId,
    resourceType: 'post',
  });

  const isApproved =
    parentPostAuditLog && parentPostAuditLog.status === AuditLogStatus.approved;

  console.log('file isApproved ', isApproved);

  const isAdmin = currentUser.id === 1;
  const parentPost = await getPostById(file.postId, { currentUser });
  const isPublished = parentPost.status === PostStatus.published;
  const canAccess = ownFile || isAdmin || (isPublished && isApproved);
  //console.log('canAccess---', canAccess);

  if (!canAccess) {
    throw new Error('FORBIDDEN');
  }
};
