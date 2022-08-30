import express from 'express';

//引入POST 的 controller
import * as postController from './post.controller';
//import { requestUrl } from '../app/app.middleware';

//排序、条件查询 ,分页
import {
  sort,
  filter,
  paginate,
  validatePostStatus,
  modeSwitcher,
} from './post.middleware';

//验证用户身份
import { authCuard, accessControl } from '../auth/auth.middleware';
//分页数据配置文件
import { POSTS_PER_PAGE } from '../app/app.config';

//开始用ROUTER
const router = express.Router();

/**
 * 获得单个内容 by id
 */
router.get('/posts/:postId', postController.showPostById);

/**
 * 获得内容列表 GET
 * sort: 'early' / last / most_comments /  default: 'post.id DESC'
 * postController中的index方法
 * paginate 分页
 *  /**filter
 * 过滤内容列表用的
 * 更具地址栏传过来的参数
 */

router.get(
  '/posts',
  sort,
  filter,
  paginate(POSTS_PER_PAGE),
  validatePostStatus,
  modeSwitcher,
  postController.index,
);

/**
 * 创建内容
 */
router.post('/posts', authCuard, validatePostStatus, postController.store);

/**
 * 更新内容 定义支持HTTP patch 更新接口
 * 以下先后顺序不能乱
 * authCuard 用户令牌验证
 * accessControl 用户更新删除权限验证
 */
router.patch(
  '/posts/:postId',
  authCuard,
  accessControl({ possession: true }),
  validatePostStatus,
  postController.update,
);

/**
 * 删除内容 DELETE
 * 以下先后顺序不能乱
 * authCuard 用户令牌验证
 * accessControl 用户更新删除权限验证
 */
router.delete(
  '/posts/:postId',
  authCuard,
  accessControl({ possession: true }),
  postController.destroy,
);

/**
 * 添加内容与标签的绑定
 */
router.post(
  '/posts/:postId/tag',
  authCuard,
  accessControl({ possession: true }),
  postController.storePostTag,
);

/**
 * 移除内容上的标签
 */

router.delete(
  '/posts/:postId/tag',
  authCuard,
  accessControl({ possession: true }),
  postController.destroyPostTag,
);

/**
 * 导出
 */
export default router;
