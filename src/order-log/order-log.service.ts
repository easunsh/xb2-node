import { connection } from '../app/database/mysql'; //数据库连接
import { OrderLogModel } from '../order-log/order-log.model';
/**
 * 创建订单日志
 */
export const createdOrderLog = async (oderLog: OrderLogModel) => {
  //准备查询
  const statement = `
        INSERT INTO order_log 
        SET ? 
     `;
  //执行
  const [data] = await connection.promise().query(statement, oderLog);
  //提供结果
  return data as any;
};
