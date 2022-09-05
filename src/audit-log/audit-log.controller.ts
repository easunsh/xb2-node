import { Request, Response, NextFunction } from 'express';
import { AuditLogStatus } from './audit-log.model';
import {
  createAuditLog,
  deleteAuditLog,
  getAuditLogByResource,
} from './audit-log.service';

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

/**
 * 取消审核
 */
export const revoke = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { resourceId, resourceType } = request.body;
  const { id: userId } = request.user;

  try {
    //最近的审核日志记录
    const [auditLog] = await getAuditLogByResource({
      resourceId,
      resourceType,
    });
    //满足取消审核条件的话
    const canRevokeAudit =
      auditLog &&
      auditLog.status === AuditLogStatus.pending &&
      auditLog.userId === userId;

    if (canRevokeAudit) {
      await deleteAuditLog(auditLog.id);
    } else {
      throw new Error('BAD_REQUEST');
    }

    response.send({ message: '成功取消审核' });
  } catch (error) {
    next(error);
  }
};
