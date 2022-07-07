import { connection } from '../app/database/mysql';  //数据库连
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';
import { GetPostsOptionsFilter } from '../post/post.service';

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


 /**
  * 检查评论是否为回复的评论
  * parentId表示当前的评论，是哪一条评论的回复
  * 最后返回如果是true就表示当前评论是一条回复，不然就是普通评论
  */
 export const isReplyComment = async (
     commentId: number
   ) => {

      //准备查询
      const statement = `
      SELECT parentId FROM comment
      WHERE id = ?
  `;

    //执行查询
  const [data]  = await connection.promise().query(statement,commentId);
    
    //返回结果
    return data[0].parentId ? true:false;
  };


  /**
   * 修改评论
   */
  export const updateComment = async (
     comment: CommentModel
    ) => {
      //准备数据
      const { id , content } = comment;

      //准备SQL
      const statement =`
        UPDATE comment
        SET content = ?
        WHERE id = ?
      `;

      //执行查询
      const [data]  = await connection.promise().query( statement , [ content , id ] );

      //提供数据
      return data;
   };


/**
 * 删除评论功能
 */
export const deleteComment = async (
   commentId: number
  ) => {
    //准备sql
    const statement = `
      DELETE FROM comment
      WHERE id = ?
    `;


    //执行SQL
    const [data] =  await connection.promise().query( statement ,commentId );

    //返回数据
    return data;
 };


/**
 * 获取评论列表
 */

interface getCommentsOptions {
  filter?: GetPostsOptionsFilter;

}


export const getComments = async (
   options: getCommentsOptions
  ) => {

    //解构
    const { filter } = options;

    let params: Array<any> = [];

    // 设置sql 参数
    if(filter.param) {
      params = [ filter.param , ...params ];

    }

    //sql ready 

    const statement = `
      SELECT
        comment.id,
        comment.content,
        ${sqlFragment.user},
        ${sqlFragment.post}
        ${filter.name == 'userReplied' ? `, ${sqlFragment.repliedComment}` : ''}
        ${filter.name !== 'userReplied' ? `, ${sqlFragment.totalReplies}` : ''}
      FROM 
        comment
        ${sqlFragment.leftJoinUser}
        ${sqlFragment.leftJoinPost}
      WHERE 
         ${ filter.sql }
      GROUP BY
        comment.id
       ORDER BY 
        comment.id DESC
    `;

    //sql query
      const [data] =  await connection.promise().query( statement , params );
    //return data
    return data;
 };