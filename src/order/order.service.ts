import { connection } from '../app/database/mysql';
import { OrderModel } from './order.model';

/**
 * 创建订单
 */
export const createOrder = async (order: OrderModel) => {
  //准备查询
  const statement = `
        INSERT INTO \`order\`
        SET ?
     `;

  //执行
  const [data] = await connection.promise().query(statement, order);
  //提供结果
  return data as any;
};

/**
 * 按照ID 调取订单
 */
export const getOrderById = async (orderId: number) => {
  //准备查询
  const statement = `
    SELECT
    *
    FROM
    \`order\`
    WHERE
      order.id = ?
     `;
  //执行
  const [data] = await connection.promise().query(statement, orderId);
  //提供结果
  return data[0] as OrderModel;
};

/**
 * 更新订单
 */
export const updateOrder = async (orderId: number, order: OrderModel) => {
  //准备查询
  const statement = `
  UPDATE \`order\`
  SET ?
  WHERE id = ?
   `;
  //执行
  const [data] = await connection.promise().query(statement, [order, orderId]);
  //提供结果
  return data as any;
};
