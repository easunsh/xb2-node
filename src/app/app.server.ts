import http from 'http';
import { Server } from 'socket.io';
import { ALLOW_ORIGIN } from './app.config';
import app from './index';

/**
 * HTTP服务器
 */
const httpServer = http.createServer(app);

/**
 * 创建一个IO 实时服务器
 * 如果要和httpServer整合到一起
 * 就吧httpServer交给它
 * 其他地方可以导入并使用，在客户端上监听发生的事件
 * 或者触发一些自定义的事件，客户端上也会实时的收到这些事件
 */
export const socketIoServer = new Server(httpServer, {
  cors: {
    origin: ALLOW_ORIGIN,
    allowedHeaders: ['X-Total-Count'],
  },
});

/**
 * 默认导出
 */
export default httpServer;
