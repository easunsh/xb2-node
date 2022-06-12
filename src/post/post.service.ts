import { connection } from '../app/database/mysql';  //数据库连接
import { PostModel } from './post.model';


export const getPosts = async () => {   //标记为异步函数
	
	//JSON_OBJECT 组织一个JSON对象 as 个名字user
	const statement = `
	SELECT 
		post.id,
		post.title,
		post.content,
		JSON_OBJECT(
			'id',user.id,
			'name',user.name
		) as user
	FROM post
    LEFT JOIN user
     ON user.id = post.userID;
	`;



	//用connection的方法，返回结果是个数组，
	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
	const [data]  = await connection.promise().query(statement);
	
	return data;




	//模拟静态数据列表
	// const data = [

	// { "content" : '明天是明天' },
	// { "content" : '今天是金天' },
	// { "content" : '后天是后天' },
		
	// ];


};


/***
 * 创建内容保存入库
 * 函数接收一个Post 参数，参数的类型是PostModel ，一个数据模型
 */

export const createPost = async ( post: PostModel) => {
	//查询 用问号，后面赋值更安全，
	const statment = `
		INSERT INTO post
		SET ?
	`;

	//执行查询 post就是 creatpost 函数接收的参数,是一个数据对象模型
	const [data] = await connection.promise().query(statment,post);

	//提供数据
	return data;
};



