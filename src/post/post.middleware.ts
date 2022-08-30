//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import { PostStatus } from './post.service';
// 旧分页所用 import { POSTS_PER_PAGE  } from '../app/app.config';

/**
 * 排序方式sort
 * 评论多少
 * 发布时间的远近
 */
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //解构获取客户端的排序方式
  const { sort } = request.query;
  //排序用的sql order 关键词
  let sqlSort: string;

  //设置排序用的sql
  switch (sort) {
    case 'early':
      sqlSort = 'post.id ASC';
      break;
    case 'last':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC , post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  //在请求中添加排序
  request.sort = sqlSort;
  console.log(request.sort);

  //下一步
  next();
};

/**filter
 * 过滤内容列表用的
 * 更具地址栏传过来的参数
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //解构查询符
  const {
    tag,
    user,
    action,
    cameraMake,
    cameraModel,
    lensModel,
    lensCopyRight,
  } = request.query;

  //设置默认的过滤
  request.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };

  // 按标签名过滤
  if (tag && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: `${tag}`,
    };
  }

  // 过滤用户发布的内容 user 是客户端通过查询符设置的用户id
  if (user && action == 'published' && !tag) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: `${user}`,
    };
  }

  // 过滤用户点赞过的内容
  if (user && action == 'liked' && !tag) {
    request.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: `${user}`,
    };
  }

  /**
   * 过滤出用某种相机拍摄的内容
   *
   */
  if (cameraMake && cameraModel) {
    request.filter = {
      name: 'camera',
      sql: `file.metadata->'$.Make' = ? AND file.metadata->'$.Model' = ?`,
      params: [`${cameraMake}`, `${cameraModel}`],
    };
  }

  /**
   * 过滤出用某种镜头拍摄的内容
   *
   */
  if (lensModel && lensCopyRight) {
    request.filter = {
      name: 'lens',
      sql: `file.metadata->'$.LensModel' = ? AND file.metadata->'$.Copyright' = ?`,
      params: [`${lensModel}`, `${lensCopyRight}`],
    };
  }

  //下一步
  next();
};

/**
 * 内容分页新
 * 执行会制造return 出一个分页中间件
 */

export const paginate = (itemsPerPage: number) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    //当前页码
    const { page = 1 } = request.query;

    //每页内容数量
    const limit = itemsPerPage || 30;

    //公式计算出偏移量
    const offset = limit * (parseInt(`${page}`, 10) - 1);

    //设置请求中的分页
    request.pagination = { limit, offset };

    //next
    next();
  };
};

/**
 * 验证内容状态
 */
export const validatePostStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //解构出来取个别名
  const { status: statusFromQuery = '' } = request.query;
  const { status: statusFromBody = '' } = request.body;

  const status = statusFromQuery || statusFromBody;

  //检查内容状态是否有效
  const isValidStatus = ['published', 'draft', 'archived', ''].includes(
    `${status}`,
  );

  if (!isValidStatus) {
    next(new Error('BAD_REQUEST'));
  } else {
    next();
  }
};

/**
 * 管理员模式切换
 */
export const modeSwitcher = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //解构查询符
  let { manage, admin } = request.query;

  //用户管理模式 等于true表示用户管理模式,把manage给到isManageMode
  const isManageMode = manage === 'true';

  //超管模式,满足3条件触发，用户管理模式+超管模式+超管token
  const isAdminMode = isManageMode && admin === 'true' && request.user.id === 1;

  if (isManageMode) {
    //用户管理模式继续做判断，是否是超管模式
    if (isAdminMode) {
      request.filter = {
        name: 'adminManagePosts',
        sql: 'post.id IS NOT NULL',
        param: '',
      };
    } else {
      request.filter = {
        name: 'userManagePosts',
        sql: 'user.id = ?',
        param: `${request.user.id}`,
      };
    }
  } else {
    //默认都是published，发布给所有人看的
    request.query.status = PostStatus.published;
  }
  //下一步
  next();
};

/**
 * 内容分页旧
 */
//   export const paginate = async (
//       request:　Request,
//       response: Response,
//       next: NextFunction
//     ) => {
//       //当前页码
//       const { page = 1 } = request.query;

//       //每页内容数量
//       const limit = parseInt( POSTS_PER_PAGE , 10 ) || 30;

//       //公式计算出偏移量
//       const offset = limit * ( parseInt(`${page}` ,10 ) - 1 );

//         //设置请求中的分页
//        request.pagination = { limit , offset };

//        //next
//        next();
//    };
