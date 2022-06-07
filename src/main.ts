//用 express 建立服务

import express from 'express'; //用JS的写法
import { Request, Response } from 'express'; //引入Ruquest Response对象，
//const res = require('express/lib/response');
const app = express(); //创建一个应用
const port = 3000; // 定义个服务端口

//使用express全局中间件json,自动处理客户端发来JSON格式，
app.use(express.json());

app.listen(port, () => {
  console.log('服务已经启动 ~~~lbbbb');
});

//app是我们创建的EXPRESS应用，只支持http get方法请求的路由,都是express自带的，后面会用typescript改造。
//用户访问如果是项目根，后面是函数处理器 req请求相关数据  ，res 响应处理
app.get('/', (request: Request, response: Response) => {
  response.send('这里是首页');
});

//模拟一下要发送到客户端的json 数据
let data = [
  {
    id: 1,
    title: 'sunyi',
    content: 'this man is a tennis fans',
  },
  {
    id: 2,
    title: 'leon',
    content: 'this man is a football fans',
  },
  {
    id: 3,
    title: 'tom',
    content: 'this man is a baskball fans',
  },
];

//如用户访问的是 /posts路径，  express 自动识别数据类型并通知客户端是JSON数据
app.get('/posts', (request: Request, response: Response) => {
  response.send(data);
});

//定义get接口，判断用户请求决定处理
//更具 postId ，来做处理  用户访问路径 主机名/posts/1
app.get('/posts/:postId', (request: Request, response: Response) => {
  //结构的同名写法，获取内容ID 同 postId:postId
  //params  get到的数据 如果用户访问的目录是1 ，params的值为 { postId: 1 }

  const { postId } = request.params; //用对象来接收对象，简写 postId为String
  console.log(request.params);

  //查找具体内容,用筛选器，与服务端数据对比 ,  item id 为 number  , postid 转为 parseInt 10进制，
  const posts = data.filter(item => item.id == parseInt(postId, 10));

  // 做出响应
  response.send(posts[0]);
});

//定义POST接口，用来处理用户发表的内容
app.post('/posts', (request: Request, response: Response) => {
  //获取用户要发表的内容 content要与客户端的json 属性名同名
  const { content } = request.body;

  //获得客户端头部数据 带横线用以下表达方法，不然可以直接点出来
  console.log(request.headers['home-name']);

  //发给客户端的头部数据
  response.set('Home-Name', 'this is Beijing');
  //设置状态码给客户端
  response.status(201);
  //响应
  response.send({ message: `成功创建了 ${content}` });
});
