import express from 'express';

//引入POST 的 controller
import * as postController from './post.controller';
//import { requestUrl } from '../app/app.middleware'; 

//排序
import { sort , filter } from './post.middleware';

//验证用户身份
import { authCuard , accessControl } from '../auth/auth.middleware';

//开始用ROUTER
const router = express.Router();


/**
 * 获得内容列表 GET
 * sort: 
 * 'early' / last / most_comments /  default: 'post.id DESC'
 * postController中的index方法
 */
router.get('/posts', sort , filter , postController.index );


/**
 * 创建内容
 */
router.post('/posts', authCuard , postController.store );

/**
 * 更新内容 定义支持HTTP patch 更新接口
 * 以下先后顺序不能乱
 * authCuard 用户令牌验证
 * accessControl 用户更新删除权限验证
 */
 router.patch( '/posts/:postId' , 
 authCuard , 
 accessControl({ possession: true }) , 
 postController.update 
 );

/**
 * 删除内容 DELETE
 * 以下先后顺序不能乱
 * authCuard 用户令牌验证
 * accessControl 用户更新删除权限验证
 */
router.delete( '/posts/:postId', 
authCuard , 
accessControl({ possession: true }) , 
postController.destroy );


/**
 * 添加内容与标签的绑定
 */
router.post('/posts/:postId/tag' , 
authCuard ,
accessControl({ possession: true }),
postController.storePostTag,
 );

 /**
  * 移除内容上的标签
  */
 
  router.delete('/posts/:postId/tag' , 
  authCuard ,
  accessControl({ possession: true }),
  postController.destroyPostTag,
   );

/**
 * 导出
 */
export default router;