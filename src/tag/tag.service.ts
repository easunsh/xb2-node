import { connection } from '../app/database/mysql';  //数据库连接
import { tagModel } from './tag.model';

/**
 * 创建标签TAG
 */
export const createTag = async ( tag: tagModel ) => {

    //查询 用问号做占位符
	const statment = `
    INSERT INTO tag
    SET ?
`;

//执行查询 
const [data] = await connection.promise().query( statment , tag );


/**
 * 提供数据
 * return data as any
 * 可以作为任意的数据类型
 * 设置成ANY可以访问data中的insertId属性
 */
return data as any;
    
 };

/**
 * 根据名字查找标签
 */
export const getTabByName = async (
   tagName : string
  ) => {
    
    //查询 
	const statment = `
    SELECT id, name FROM tag
    WHERE name = ?
`;

//执行查询
const [data] = await connection.promise().query(statment,tagName);

/**
 * 提供数据,是否有数据
 */
 return data[0];
    

 };