import { connection } from '../app/database/mysql';  //数据库连
import { AvatarModel } from '../avatar/avatar.model';

/**
 * 保存文件头像信息
 */
export const createAvatar = async (
   avatar: AvatarModel
  ) => {
    const statement = `
        INSERT INTO avatar
        SET ?
    `;

    //执行 sql
     const [data]  = await connection.promise().query(statement,avatar);

     //提供数据
     return data;
 };


 /**
  * 按用户ID 查找头像
  */
 /**
  * 
  */
 export const findAvatarByUserId = async (
    userId: number
   ) => {
     
    //准备sql
    const statement = `
        SELECT * 
        FROM avatar
        WHERE userId = ?
        ORDER BY avatar.id DESC
        LIMIT 1
    `;

    
    //执行 sql
    const [data]  = await connection.promise().query(statement,userId);

    //提供数据
    return data[0];

  };
