import { connection } from '../app/database/mysql';

/**
 * 搜索标签
 */
interface SearchTagsOptions {
  name?: string;
}

export const searchTags = async (options: SearchTagsOptions) => {
  //解构选项
  const { name } = options;

  //sql参数{
  const params: Array<any> = [`%${name}%`];
  //准备查询
  const statement = `
    SELECT
        tag.id,
        tag.name,
        (
            SELECT COUNT(post_tag.tagId)
            FROM post_tag
            WHERE tag.id = post_tag.tagId
        ) as totalPosts
        FROM
            tag
        WHERE
           tag.name LIKE ?
        ORDER BY
            totalPosts DESC
        LIMIT
            10
   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data as any;
};

/**
 * 搜索用户
 */
interface SearchUsersOptions {
  name?: string;
}

export const searchUsers = async (options: SearchUsersOptions) => {
  //解构选项
  const { name } = options;

  //sql参数{
  const params: Array<any> = [`%${name}%`];
  //准备查询
  const statement = `
    SELECT
        user.id,
        user.name,
        (
          SELECT 
            IF(
            COUNT(avatar.id),1,NULL
            )
            FROM avatar
            WHERE avatar.userId = user.id
      ) AS avatar,

        (
            SELECT COUNT(post.id)
            FROM post
            WHERE post.userId = user.id
        ) AS totalPosts
        FROM
            user
        WHERE
           user.name LIKE ? 
        ORDER BY
          user.id
   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data as any;
};

/**
 * 搜索相机
 */
interface SearchCamerasOptions {
  makeModel?: string;
}

export const searchCameras = async (options: SearchCamerasOptions) => {
  //解构选项
  const { makeModel } = options;

  //sql参数{
  const params: Array<any> = [`%${makeModel}%`];

  /**
   * 相机型号
   * json_extract，
   *相机信息字段json数据较大，每次全部取出再去解析查询效率较
   *低，也比较麻烦，则Mysql5.7版本提供提供函数json_extract，可以
   *通过key查询value值，比较方便。
   */
  const makeModelField = `JSON_EXTRACT(file.metadata,"$.Make","$.Model")`;
  //准备查询
  const statement = `
    SELECT
       ${makeModelField} as camera,
       COUNT( ${makeModelField} ) as totalPosts
      FROM
       file
       WHERE
        ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
        GROUP BY
        ${makeModelField}
        LIMIT
          10
   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data as any;
};

/**
 * 搜索镜头
 */
interface SearchLensOptions {
  makeModel?: string;
}

export const searchLens = async (options: SearchLensOptions) => {
  //解构选项
  const { makeModel } = options;

  //sql参数{
  const params: Array<any> = [`%${makeModel}%`];

  /**
   * 相机型号
   */
  const makeModelField = `JSON_EXTRACT(file.metadata,"$.LensMake","$.LensModel")`;
  //准备查询
  const statement = `
    SELECT
       ${makeModelField} as lens,
       COUNT( ${makeModelField} ) as totalPosts
      FROM
       file
       WHERE
        ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
        GROUP BY
        ${makeModelField}
        LIMIT
          10
   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  //提供结果
  return data as any;
};
