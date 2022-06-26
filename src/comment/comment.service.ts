import { connection } from '../app/database/mysql';  //数据库连
import { CommentModel } from './comment.model';

/**
 * 创建评论
 */
export const createComment = async (
   comment: CommentModel
  ) => {
    //准备查询
    const statement = `
        INSERT INTO comment
        SET ?
    `;


    //执行SQL
    const [data]  = await connection.promise().query(statement,comment);
	
	return data;

 };