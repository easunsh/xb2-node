import { connection } from '../app/database/mysql';  //数据库连

/**
 * 保存用户点赞内容 
 */
export const createUserLikePost = async (
   userId: number , postId: number
  ) => {
    
    //准备sql
    const statement = `
        INSERT INTO
            user_like_post (userId , postId)
        VALUES (? , ?)
    `;

    const [data]  = await connection.promise().query(statement,[userId , postId]);

    //返回数据
    return data;
 };


 /**
  * 取消用户点赞
  */
 export const deleteUserLikePost = async (
    userId: number , postId: number
   ) => {
    
    //sql ready
    const statement = `
        DELETE FROM user_like_post
        WHERE  userId = ? AND postId = ?
    `;

    //准备查询
    const [data]  = await connection.promise().query(statement,[userId , postId]);
    
    //准备数据
    return data;

  };