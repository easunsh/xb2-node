//应用都放在这里
import express from 'express';

//导入router
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import appRouter from './app.router';
import searchRouter from '../search/search.router';
//接口操作日志
import auditLogRouter from '../audit-log/audit-log.router';
//访问统计
import dashboardRouter from '../dashboard/dashboard.router';
//微信
import weixinLoginRouter from '../weixin-login/weixin-login.router';
//产品
import productRouter from '../product/product.router';
//payment
import paymentRouter from '../payment/payment.router';
//订单
import orderRouter from '../order/order.router';
//跨域
import cors from 'cors';
import { ALLOW_ORIGIN } from './app.config';

//导入中间件 默认错误处理器
import { defaultErrorHandler } from './app.middleware';
//获得当前用户中间件
import { currentUser } from '../auth/auth.middleware';

//创建EXPRESS 应用 app
const app = express();

//开始use  处理JSON
app.use(express.json());

//跨域资源共享 ，注意要放在路由的上面，不然就不起作用
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 获得当前用户的
 * 全局中间件
 * 放在路由的上面
 */
app.use(currentUser);

/**
 * 开始use 处理路由
 * @return  use 应用就包含postRouter中包含的接口
 */
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  avatarRouter,
  commentRouter,
  likeRouter,
  appRouter,
  searchRouter,
  auditLogRouter,
  dashboardRouter,
  weixinLoginRouter,
  productRouter,
  paymentRouter,
  orderRouter,
);

//开始use 默认异常处理器
app.use(defaultErrorHandler);

//导出应用为默认 默认为index
export default app;
