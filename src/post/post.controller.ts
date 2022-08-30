//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
//导入LODASH
import _ from 'lodash';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createPostTag,
  postHasTag,
  deletePostTag,
  getPostsTotalCount,
  getPostById,
  PostStatus,
} from './post.service';

import { tagModel } from '../tag/tag.model';
import { deletePostFiles, getPostFiles } from '../file/file.service';
import { getTabByName, createTag } from '../tag/tag.service';
import { PostModel } from './post.model';

//内容列表
export const index = async (
  //标记异步
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // console.log('index request user is', request.user);

  //解构查询符
  const { status = '' } = request.query;
  try {
    //统计内容数量
    const totalCount = await getPostsTotalCount({
      filter: request.filter,
      status: status as any,
    });

    //将 统计内容数量 设置响应头部 返回给客户端
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    //加入await，去等待一个执行的结果
    //sort 是排序选项，需要去扩展request的类型
    //filter 地址栏传入查询的类型，
    const posts = await getPosts({
      sort: request.sort,
      filter: request.filter,
      pagination: request.pagination,
      currentUser: request.user,
      status: status as any,
    });

    response.send(posts);
  } catch (error) {
    //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
    next(error);
  }

  //console.log(request.headers);
  //模拟一下错误
  //   if ( request.headers.authorization !== 'SECRET' ) {

  //     return next ( new Error() );  //return 不然会一直执行下去

  // }
};

/***
 *
 * 创建内容 保存入库
 *
 */

export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备需要存储的数据 ，从请求的主体json中解构出来，
  const { title, content, status = PostStatus.draft } = request.body;

  //解构扩展出来的request.user 里的ID ，重命名为userid
  const { id: userId } = request.user;

  const post: PostModel = {
    title,
    content,
    userId,
    status,
  };

  //创建内容
  try {
    //将需要存储的内容交给函数
    const data = await createPost(post);
    //做出一个响应
    response.status(201).send(data);
  } catch (error) {
    //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
    next(error);
  }
};

/**
 * 更新内容的接口
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取需要更新内容的ID
  const { postId } = request.params; //所有的请求地址参数

  //准备要更新的数据 更新title 会给CONTENT赋值NULL  会用LODASH改造
  //const { title, content } = request.body;
  const post = _.pick(request.body, ['title', 'content', 'status']);

  //执行更新
  try {
    //const data = await updatePost( parseInt( postId , 10 ) ,{ title , content });
    const data = await updatePost(parseInt(postId, 10), post);
    response.send(data);
  } catch (error) {
    //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
    next(error);
  }
};

/**
 * 删除内容
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取请求地址的内容ID
  const { postId } = request.params;

  try {
    /**
     * 删除内容相关文件的方法
     * 如果有文件，就删除
     */
    const files = await getPostFiles(parseInt(postId, 10));
    if (files.length) {
      console.log('files.length');
      await deletePostFiles(files);
    }
    //删除内容
    const data = await deletePost(parseInt(postId, 10));
    response.send(data);
  } catch (error) {
    //这样会把异常交给默认的异常处理器去处理。 app.middleware.ts中定义的
    next(error);
  }
};

/**
 * 添加内容与标签的关联
 */
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 body中的tag是个json对象
  const { postId } = request.params;
  const { name } = request.body;

  let tag: tagModel;

  //查找标签是否存在
  try {
    tag = await getTabByName(name);
  } catch (error) {
    return next(error);
  }

  //如果数据库内有该标签
  if (tag) {
    try {
      //查看该标签是否与内容已经绑定
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }

  //如果数据库内没有该标签，需要先创建
  if (!tag) {
    try {
      const data = await createTag({ name });

      //data.inertId 为创建的数据记录的id 号，新鲜出炉，需要将data返回时候设置成as any类型
      tag = { id: data.insertId };
      console.log('----new tag id is ' + tag.id);
    } catch (error) {
      return next(error);
    }
  }

  //最后给内容打上标签
  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容上的标签
 */
export const destroyPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 ,body中的tag是个json对象,postId是string
  const { postId } = request.params;
  const { tagId } = request.body;

  //移除内容标签
  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * 查询单个内容
 * post by id
 */
export const showPostById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { postId } = request.params;

  //调取内容
  try {
    //console.log('showPostById request user is', request.user);
    const post = await getPostById(parseInt(postId, 10), {
      currentUser: request.user,
    });

    //做出响应
    response.send(post);
  } catch (error) {
    next(error);
  }
};
