import { connection } from '../app/database/mysql';  //数据库连接
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';

/**
 * 获取内容列表
 * 可排序利用interface
 * @returns 
 */
/**
 * sql中的 where 条件
 * 	name 是过滤器的名字
 *  sql 是sql语句,包含占位符
 *  param 是占位符的值
 * */
 
export interface GetPostsOptionsFilter {
	name: string;
	sql?: string;
	param?: string;
}

/**
 * 分页
 * limit 当前页展示几条
 * offset 偏移量
 */
export interface GetPostOptionsPagination {

	limit: number;
	offset: number;
}


/**
 * sql中的所需
 * sort 排序
 * filter 过滤地址栏参数做判断
 * pagination 分页参数
 */

interface GetPostsOptions {

	sort?: string;	
	filter?: GetPostsOptionsFilter;
	pagination?: GetPostOptionsPagination;
}


/**
 * 查询内容的主程序
 * @param options 
 * @returns 
 */
export const getPosts = async ( options: GetPostsOptions ) => {   //标记为异步函数
	
	const { sort , filter , pagination: { limit , offset } } = options;

	//sql 执行查询给sql占位符提供的值
	let params: Array<any> = [ limit , offset ];
	if( filter.param ){

		params = [ filter.param , ...params ];
	}

	//设置sql参数
	

	//JSON_OBJECT 组织一个JSON对象 as 个名字user
	const statement = `
	SELECT 
		post.id,
		post.title,
		post.content,
		${ sqlFragment.user },
		${ sqlFragment.totalComments },
		${ sqlFragment.file},
		${ sqlFragment.tags },
		${ sqlFragment.totalLikes }
	FROM post
	  ${ sqlFragment.leftJoinUser }
	  ${ sqlFragment.innerJoinOneFile }
	  ${ sqlFragment.leftJoinTag }
	  ${ filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
	  WHERE ${ filter.sql }
	  GROUP BY post.id
	  ORDER BY ${ sort }
	  LIMIT ?
	  OFFSET ?
	`;



	//用connection的方法，返回结果是个数组，
	//需要第一个项目是我们需要的数据 ，用await等待执行，函数需要标记为async
	//params 为占位符的具体值
	const [data]  = await connection.promise().query(statement , params );
	
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



/***
 * 更新内容的
 * 更新的ID 和 更新的内容
 */
export const updatePost = async ( postId:number , post: PostModel ) => {

	//准备查询，第一个问号是更新的内容，第二个是更新的ID号
	const statement = `
		UPDATE post
		SET ?
		WHERE id = ?
	`;

	//执行查询 []里对应statement 2个问号要传的内容
	const [data] = await connection.promise().query(statement,[post,postId]);
	//提供数据
	return data;
};


/**
 * 删除数据用的接口
 */
export const deletePost = async (postId: number) => {

	//准备SQL语句
	const statement = `
		DELETE FROM post
		WHERE id = ?
	`;

	//执行查询
	const [data]  = await connection.promise().query(statement,postId);

	//返回数据
	return data;

}

/**
 * 保存内容与标签的关联
 */
export const createPostTag = async (
   postId: number , tagId: number
  ) => {

	//查询语句
	const statement = `
		INSERT INTO post_tag ( postId , tagId )
		VALUES(?,?)
	`;

	//执行查询
	const [data]  = await connection.promise().query(statement,[ postId , tagId ]);

	//返回数据
	return data;
	
 };


 /**
  * 检查内容是否已经打上某标签
  */
 export const postHasTag = async (
		postId: number , tagId: number
   ) => {

	//sql语句
	const statement = `
		SELECT * FROM post_tag
		WHERE postId = ? AND tagId = ?
	`;

	//执行查询
	const [data]  = await connection.promise().query(statement,[ postId , tagId ]);
	 
	/**
	 * 提供数据
	 * 判断是否有值
	 * 有值TRUE 否则FALSE
	 */
	return data[0] ?  true : false;
  };


/**
 * 删除一条内容与标签的关联
 */
 export const deletePostTag = async (
	postId: number , tagId: number
   ) => {
 
	 //查询语句
	 const statement = `
		 DELETE FROM post_tag
		 WHERE postId = ? AND tagId = ? 
	 `;
 
	 //执行查询
	 const [data]  = await connection.promise().query(statement,[ postId , tagId ]);
 
	 //返回数据
	 return data;
	 
  };

  /**
   * 统计内容数量 给客户端
   */
  export const getPostsTotalCount = async (
	 options: GetPostsOptions
	) => {

		const { filter } = options;

		//sql 参数
		let params = [ filter.param ];

		//准备查询
		const statement = `
			SELECT
			 COUNT(DISTINCT post.id) AS total
			 FROM post
			 ${ sqlFragment.leftJoinUser }
			 ${ sqlFragment.innerJoinOneFile }
			 ${ sqlFragment.leftJoinTag }
			 ${ filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
			 WHERE ${ filter.sql }
		`;

		//执行查询
		const [data] = await connection.promise().query( statement , params );

		//提供结果
		return data[0].total;
	  
   };

   /**
	* 根据内容ID获得内容详情
	*/
   export const getPostById = async (
	  postId: number
	 ) => {
		//sql ready
		const statement = `
			SELECT 
				post.id,
				post.title,
				post.content,
				${ sqlFragment.user },
				${ sqlFragment.totalComments },
				${ sqlFragment.file },
				${ sqlFragment.tags }, 
				${ sqlFragment.totalLikes }
			FROM post
				${ sqlFragment.leftJoinUser }
				${ sqlFragment.leftJoinOneFile }
				${ sqlFragment.leftJoinTag }
			WHERE post.id = ?
		`;

			//执行查询
			const [data] = await connection.promise().query( statement , postId );

			//如果没有找到相关内容
			if( !data[0].id){

				throw new Error('POSTS_NOT_FOUND');

			}

			//提供结果
			return data[0];

	   
	};