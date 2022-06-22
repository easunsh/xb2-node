import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';

/**
 * 存储文件信息
 * 问号是占位符
 */
export const createFile = async (
   file: FileModel
  ) => {
    const statment = `
    INSERT INTO file
    SET ?
`;

//执行查询 函数接收的参数,是一个数据对象模型
const [data] = await connection.promise().query( statment , file );

//提供数据
return data;
 };


  /**
  * 按照ID查找文件
  */
   export const findFileById = async ( fileId: number ) => {
     //准备查询
   	//JSON_OBJECT 组织一个JSON对象 as 个名字user
	const statement = `
	SELECT * FROM file
    WHERE id = ?
	`;

	//用connection的方法，返回结果是个数组，
	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
	const [data]  = await connection.promise().query( statement,fileId );
	
	return data[0];

  };