import express from 'express';
import { ProductType } from '../product/product.model';
import { postProcessSubscription } from '../subscription/subscription.service';
import { getOrderById } from '../order/order.service';
import { getProductById } from '../product/product.service';
import { UserMetaType } from '../user-meta/user-meta.model';
import {
  createUserMeta,
  getUserMetaByWeixinUnionId,
  updateUserMeta,
} from '../user-meta/user-meta.service';
import { logger, xmlBuilder, xmlParser } from './app.service';
import { paymentRecived } from '../payment/payment.service';
const router = express.Router();

//简单测试
router.get('/', (request, response) => {
  response.send({ title: '依桑国度' });
});

router.post('/echo', async (request, response) => {
  //测试logo4j
  // logger.info('test-----');
  // logger.error('test-----');
  // logger.debug('test-----');

  //测试XML
  const xmlData = xmlBuilder.buildObject({
    message: '你好!',
  });

  logger.info('xmlData', xmlData);

  //data 就是解析之后的对象数据
  const data = await xmlParser.parseStringPromise(xmlData);
  logger.debug('data', data);
  response.status(201).send(request.body);
  //测试模拟微信登录的
  //模拟获取用户数据
  // const userMeta = await getUserMetaByWeixinUnionId('321');

  // response.status(201).send(userMeta);
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
 * orderId 为 刚刚的insertid
 */
router.post('/pay/:orderId', async (request, response) => {
  const { orderId } = request.params;
  const order = await getOrderById(parseInt(orderId, 10));
  const product = await getProductById(order.productId);

  if (product.type === ProductType.subscription) {
    postProcessSubscription({ order, product });
  }

  response.sendStatus(200);
});

/**
 * 测试收到付款的方法
 */

router.post('/payments/notify', async (request, response) => {
  // const { orderId } = request.body;
  // paymentRecived(orderId, { message: '通知数据~~' });
  response.sendStatus(200);
});

/**
 * 导出路由
 */
export default router;
