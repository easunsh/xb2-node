import app from './app';  //index文件，会自动寻找，不用写明
import { APP_PORT } from './app/app.config';

app.listen( APP_PORT,()=>{   //替换3000

  console.log('服务启动');
});