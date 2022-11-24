import { connection } from '../app/database/mysql';
import { PaymentUrlModel } from './payment-url.model';

/**
 * create payment url
 */
export const createPaymentUrl = async (paymentUrl: PaymentUrlModel) => {
  //准备查询
  const statement = `
    INSERT INTO payment_url
    SET ?
     `;
  //执行
  const [data] = await connection.promise().query(statement, paymentUrl);
  //提供结果
  return data as any;
};

/**
 * update payment url
 */
export const updatePaymentUrl = async (
  paymentUrlId: number,
  paymentUrl: PaymentUrlModel,
) => {
  //准备查询
  const statement = `
      UPDATE payment_url
      SET ?
      WHERE payment_url.id = ?
       `;
  //执行
  const [data] = await connection
    .promise()
    .query(statement, [paymentUrl, paymentUrlId]);
  //提供结果
  return data as any;
};

/**
 * get  payment url by token
 */
export const getPaymentUrlByToken = async (token: string) => {
  //准备查询
  const statement = `
        SELECT 
            *
        FROM
            payment_url
        WHERE
            payment_url.token = ?
         `;
  //执行
  const [data] = await connection.promise().query(statement, token);
  //提供结果
  return data[0] as PaymentUrlModel;
};
