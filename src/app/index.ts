//应用都放在这里
import express from 'express';

//导入post.router.ts
import postRouter from '../post/post.router';
//导入post.router.ts
import userRouter from '../user/user.router';
//导入auth.router.ts
import authRouter from '../auth/auth.router';

//导入中间件
import { defaultErrorHandler } from './app.middleware';

//创建应用
const app = express();

//开始use  处理JSON
app.use( express.json() );

/**
 * 开始use 处理路由
 * @return
 */
app.use( postRouter , userRouter , authRouter );  // use 应用就包含postRouter中包含的接口


//开始use 默认异常处理器
app.use( defaultErrorHandler );

//导出应用为默认 默认为index
export default app;