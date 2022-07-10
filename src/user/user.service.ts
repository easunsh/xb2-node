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
 * 
 * @param name getUser 获取用户
 * @param options 
 * @returns 按照条件查找用户
 *  按用户名，或按ID , 分传密码和不传密码2中选择
 */

//接口简单理解就是一种约定，一种协议，使得实现接口的类在形式上保持一致
interface GetUserOptions {
	password?:boolean;
}

export const getUser = (  //公共方法，更具传入值不同制造函数
	condition: string
)=>{

		return async ( //标记为异步函数
			param: string | number,  //接收用户名或ID 
			options: GetUserOptions = {}   //如未传值，给个默认值为空
		) => {   
		
		const { password } = options;

		//PASSWORD如果为true加上password字段一起查 ，否则为空白
		const statement = `
		SELECT 
			user.id, 
			user.name,
			IF ( 
				COUNT( avatar.id ),
				1,
				NULL
			) AS avatar
			${ password ? ',password' : ''} 
			FROM user
			LEFT JOIN avatar
			ON avatar.userId = user.id
			WHERE
			 ${condition} = ?
		`;

		//用connection的方法，返回结果是个数组，
		//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
		const [data]  = await connection.promise().query(statement,param);
		
		//提供数据，唯一的用户名，如果没有找到，就是UNDEFIND
		return data[0].id ? data[0] : null;

		};

};


/**
 * 按照用户名获取用户
 */
export const getUserByName = getUser('user.name');

/**
 * 按照用户ID 获取用户
 */
export const getUserById= getUser('user.id');

/**
 * 更新用户
 */
export const updateUser = async (
   userId: number, userData: UserModel
  ) => {


	//准备查询
	const statement =`
	UPDATE user
	SET ?
	WHERE user.id = ?
	 `;

	 //SQL 参数
	 const params = [ userData , userId ];

	
	//执行
	  const [data] =  await connection.promise().query( statement , params );

	  
	//提供结果
	 return data;
	
 };




// export const getUserByName = async ( //标记为异步函数

// 	name: string,
// 	options: GetUserOptions = {}   //如未传值，给个默认值为空

// 	) => {   
	
// 	const { password } = options;

// 	//PASSWORD如果为true加上password字段去查 ，否则为空白
// 	const statement = `
// 	SELECT 
// 		id,name
// 		${ password ? ',password' : ''} 
//         FROM user
// 		WHERE name = ?
// 	`;

// 	//用connection的方法，返回结果是个数组，
// 	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
// 	const [data]  = await connection.promise().query(statement,name);
	
//     //提供数据，唯一的用户名，如果没有找到，就是UNDEFIND
// 	return data[0];


// };

/**
 * 删除用户
 * 
 */
export const deleteUser = async (
   userId : number
  ) => {
	//准备查询
	const statement =`
	   DELETE FROM user
	   WHERE id = ?	
	 `;
	//执行
	  const [data] =  await connection.promise().query( statement , userId );
	//提供结果
	 return data;
 };
