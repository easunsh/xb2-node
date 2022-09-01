import { connection } from '../app/database/mysql';
import { AuditLogModel } from './audit-log.model';

/**
 * 创建审核日志
 */
export const createAuditLog = async (auditLog: AuditLogModel) => {
  //准备查询
  const statement = `
        INSERT INTO audit_log
        SET ?
     `;
  //执行
  const [data] = await connection.promise().query(statement, auditLog);
  //提供结果
  return data;
};
