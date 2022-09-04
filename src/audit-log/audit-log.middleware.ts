import { Request, Response, NextFunction } from 'express';
import { possess } from '../auth/auth.service';
import { AuditLogStatus } from './audit-log.model';
import { getAuditLogByResource } from './audit-log.service';
/**
 * 审核日志守卫
 */
export const auditLogGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备用户
  const { id: userId, name: userName } = request.user;
  //准备数据
  const { resourceId, resourceType, note, status } = request.body;
  //验证资源类型
  const isValidResourceType = ['post', 'comment'].includes(resourceType);

  if (!isValidResourceType) {
    return next(new Error('BAD_REQUEST'));
  }

  //准备日志数据
  request.body = {
    userId,
    userName,
    resourceType,
    resourceId,
    note,
    status,
  };

  //管理员
  const isAdmin = userId === 1;

  if (!isAdmin) {
    request.body.status = AuditLogStatus.pending;

    //检查是否拥有资源权限
    try {
      const ownResource = await possess({ resourceId, resourceType, userId });

      if (!ownResource) {
        return next(new Error('USER_DOSE_NOT_OWN_RESOURCE'));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * 检查审核日志状态是否相同、
   * 与最近的一次提交的审核日志状态是否相同
   */
  try {
    const [auditLog] = await getAuditLogByResource({
      resourceId,
      resourceType,
    });
    //如果需要插入的状态和数据库里查出来的最近的一次状态相同，就报错
    const isSameStatus = auditLog && auditLog.status === status;
    if (isSameStatus) {
      return next(new Error('BAD_REQUEST'));
    }
  } catch (error) {
    return next(error);
  }

  //下一步
  next();
};

/**
 * 删除日志守卫
 */
export const deleteAuditLogGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备用户
  const { id: userId } = request.user;
  //准备数据
  const { resourceId, resourceType } = request.body;

  //检查是否拥有资源权限
  try {
    const ownResource = await possess({ resourceId, resourceType, userId });

    if (!ownResource) {
      return next(new Error('USER_DOSE_NOT_OWN_RESOURCE'));
    }
  } catch (error) {
    return next(error);
  }

  //下一步
  next();
};
