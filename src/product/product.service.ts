import { ProductModel } from './product.model';
import { connection } from '../app/database/mysql'; //数据库连接
/**
 * 按类型调取产品
 */
export interface GetProductByTypeOptions {
  meta?: {
    subscriptionType: string;
  };
}

export const getPorductByType = async (
  type: string,
  options: GetProductByTypeOptions = {},
) => {
  const { meta } = options;
  //查询参数

  const params = [type];

  //订阅类型条件
  let andWhereSubScriptionType = '';

  if (meta && meta.subscriptionType) {
    andWhereSubScriptionType = `AND JSON_EXTRACT(product.meta,"$.subscriptionType") = ?`;
    params.push(meta.subscriptionType);
  }

  //准备查询
  const statement = `
    SELECT
        product.id,
        product.type,
        product.title,
        product.description,
        product.price,
        product.salePrice,
        product.meta
    FROM
        product
    WHERE
        product.type = ?
        AND
        product.status = "published"
        ${andWhereSubScriptionType}
        ORDER BY id DESC
        LIMIT 1
   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data[0] as ProductModel;
};
