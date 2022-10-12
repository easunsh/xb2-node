import express from 'express';
import { UserMetaType } from '../user-meta/user-meta.model';
import {
  createUserMeta,
  getUserMetaByWeixinUnionId,
  updateUserMeta,
} from '../user-meta/user-meta.service';
const router = express.Router();

//简单测试
router.get('/', (request, response) => {
  response.send({ title: '小白兔开发之路' });
});

router.post('/echo', async (request, response) => {
  //测试模拟微信登录的
  //模拟获取用户数据
  const userMeta = await getUserMetaByWeixinUnionId('321');

  response.status(201).send(userMeta);
  //用户数据模拟
  //const userMeta = {
  //     userId: 1,
  //     type: UserMetaType.weixinUserInfo,
  //     info: JSON.stringify({ unionid: '321' }), //组织个json
  //   };
  //创建测试
  // createUserMeta(userMeta);
  //update 测试
  //updateUserMeta(1, userMeta);
  // response.status(201).send(request.body);
});

/**
 * 导出路由
 */
export default router;
