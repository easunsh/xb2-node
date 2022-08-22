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
