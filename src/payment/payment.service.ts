import { PaymentModel, PaymentStatus } from './payment.model';
import { connection } from '../app/database/mysql'; //数据库连接
/**
 * 获取支付方法
 */

export interface GetPaymentOptions {
  status?: PaymentStatus;
}
export const getPayments = async (options: GetPaymentOptions = {}) => {
  const { status = 'published' } = options;

  //准备查询
  const statement = `
SELECT
    payment.id,
    payment.name,
    payment.title,
    payment.description,
    payment.meta
FROM
    payment
WHERE
    payment.status = ?
ORDER BY payment.index ASC
`;
  //执行
  const [data] = await connection.promise().query(statement, status);
  //提供结果
  return data as PaymentModel;
};
