import { Request, Response, NextFunction } from 'express';
import { uid } from '../app/app.service';
import { createDownload, getDownloadById } from './download.service';

/**
 * 创建下载
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const {
    body: { resourceType, resourceId, license },
    user: { id: userId },
  } = request;

  try {
    let licenseId: number | null;

    if (license) {
      licenseId = license.id;
    }

    const token = uid();

    const data = await createDownload({
      userId,
      licenseId,
      token,
      resourceType,
      resourceId,
    });

    const download = await getDownloadById(data.insertId);

    response.send(download);
  } catch (error) {
    next(error);
  }
};
