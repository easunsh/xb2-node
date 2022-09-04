import { Request, Response, NextFunction } from 'express';
import { createAuditLog, deleteAuditLog } from './audit-log.service';

/**
 * 创建审核日志
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await createAuditLog(request.body);

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除审核日志
 */
export const deleteAuditLogControl = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { logId: id } = request.params;
  try {
    const data = await deleteAuditLog(parseInt(id));

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }

  next();
};
