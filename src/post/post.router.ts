import express from 'express';

//引入POST 的 controller
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware'; 

//验证用户身份
import { authCuard , accessControl } from '../auth/auth.middleware';

//开始用ROUTER
const router = express.Router();


/**
 * 获得内容列表
 */
//get 方法   postController中的index方法
router.get('/posts', requestUrl, postController.index );


/**
 * 创建内容
 */
router.post('/posts', authCuard , postController.store);

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
 * 导出
 */
export default router;