import { connection } from '../app/database/mysql';  //数据库连接
import { UserModel } from './user.model'; 

/***
 * 新建用户保存入库
 * 函数接收一个user 参数，参数的类型是userModel ，一个数据模型
 */

 export const createUser = async ( user: UserModel) => {
	//查询 用问号，后面赋值更安全，
	const statment = `
		INSERT INTO user
		SET ?
	`;

	//执行查询 post就是 creatpost 函数接收的参数,是一个数据对象模型
	const [data] = await connection.promise().query(statment,user);

	//提供数据
	return data;
};


/**
 * 按用户名查找用户 , 分传密码和不传密码2中选择
 * @returns 按用户名查找用户
 */

//接口简单理解就是一种约定，一种协议，使得实现接口的类在形式上保持一致
interface GetUserOptions {
	
	password?:boolean;

}

export const getUserByName = async ( //标记为异步函数

	name: string,
	options: GetUserOptions = {}   //如未传值，给个默认值为空

	) => {   
	
	const { password } = options;

	//PASSWORD如果为true加上password字段去查 ，否则为空白
	const statement = `
	SELECT 
		id,name
		${ password ? ',password' : ''} 
        FROM user
		WHERE name = ?
	`;

	//用connection的方法，返回结果是个数组，
	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
	const [data]  = await connection.promise().query(statement,name);
	
    //提供数据，唯一的用户名，如果没有找到，就是UNDEFIND
	return data[0];


};
