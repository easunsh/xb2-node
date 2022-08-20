//import app from './app';  // 去找index文件，会自动寻找，不用写明
import httpServer from './app/app.server';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql'; //数据库连接

httpServer.listen(APP_PORT, () => {
  //替换3000

  console.log('服务启动');
});

//测试使用数据库连接
connection.connect(error => {
  if (error) {
    console.log('连接数据库失败', error.message);
    return;
  }

  console.log('连接数据库成功！');
});
