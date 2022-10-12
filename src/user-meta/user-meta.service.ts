import { connection } from '../app/database/mysql';
import { UserMetaModel, UserMetaType } from './user-meta.model';

/**
 * 创建用户meta
 */
export const createUserMeta = async (userMeta: UserMetaModel) => {
  //准备查询
  const statement = `
    INSERT INTO user_meta
    SET ?
   `;
  //执行
  const [data] = await connection.promise().query(statement, userMeta);
  //提供结果
  return data as any;
};

/**
 * 更新用户META
 */
export const updateUserMeta = async (
  userMetaId: number,
  userMeta: UserMetaModel,
) => {
  //准备查询
  const statement = `
      UPDATE user_meta
      SET ?
      WHERE user_meta.id = ?
       `;

  //Sql参数
  const params = [userMeta, userMetaId];
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data as any;
};

/**
 * 按照INFO 字段属性获取用户META
 */
const getUserMetaByInfoProp = (type: string, infoPropName: string) => {
  return async (value: string | number) => {
    //准备查询
    const statement = `
      SELECT
        *
      FROM
        user_meta
      WHERE
        user_meta.type = ?
        AND JSON_EXTRACT(user_meta.info , "$.${infoPropName}") = ?
      ORDER BY
       user_meta.id DESC
      LIMIT 1
       `;

    //sql 参数
    const params = [type, value];
    //执行
    const [data] = await connection.promise().query(statement, params);
    //提供结果
    return data[0] ? (data[0] as UserMetaModel) : null;
  };
};

export const getUserMetaByWeixinOpenId = getUserMetaByInfoProp(
  UserMetaType.weixinUserInfo,
  'openid', //加密之后的微信用户的账户
);

export const getUserMetaByWeixinUnionId = getUserMetaByInfoProp(
  UserMetaType.weixinUserInfo,
  'unionid', //微信用户在我们应用中统一的ID
);
