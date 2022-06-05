//用 express 建立服务
const { response } = require('express');
const express = require('express');  //导入包
const res = require('express/lib/response');
const app = express();  //创建一个应用
const port = 3000; // 定义个服务端口

app.listen( port , ()=> {
	console.log('服务已经启动');
});

//app是我们创建的EXPRESS应用，只支持http get方法请求的路由
//用户访问如果是项目根，后面是函数处理器 req请求相关数据  ，res 响应处理
app.get('/', ( request, response ) => {
	response.send('这里是首页');
} );  

//模拟一下要发送到客户端的json 数据
let data = [ 
{

	"id":1,
	"title":'sunyi',
	"content":'this man is a tennis fans'	
},
{

	"id":2,
	"title":'leon',
	"content":'this man is a football fans'	
},
{

	"id":3,
	"title":'tom',
	"content":'this man is a baskball fans'	
},
];

//如用户访问的是 /posts路径，  express 自动识别数据类型并通知客户端是JSON数据
app.get( '/posts' , ( request, response ) => {
	response.send(data);
} );



//定义接口，判断用户请求决定处理
//更具 postId ，来做处理  用户访问路径 主机名/posts/1

app.get('/posts/:postId',( request, response ) => {
	
	//结构的同名写法，获取内容ID 同 postId:postId
    //params  get到的数据 如果用户访问的目录是1，params的值为 { postId: 1 }	


	const { postId } = request.params;  //用对象来接收对象，简写
	console.log(request.params);
	
	//查找具体内容,用筛选器，与服务端数据对比
	const posts = data.filter( item => item.id == postId );
	
	// 做出响应
	response.send(posts[0]);
	
});






//-----------------------------------------------------------------------------------------

//const http = require('http');  //通过 http使用里面的功能

//模拟服务器端
//request请求 和 response响应名字可自定义，但顺序不能错，可能req ,res
// const server = http.createServer(( request,response) =>{


//客户端设置JSON去响应

// let data = {
// 	"id":1,
// 	"title":'sunyi',
// 	"content":'hahhahahaha'	

// }

//转换
// let jsonData = JSON.stringify(data);

// response.writeHead(200,{
	
// 	'Content-Type':'application/json;carset=utf-8'

// });

// response.write(jsonData);


//console.log(request.headers['user-agent']);
//可以用HTML格式来输出，200是状态码标识成功处理了请求，
// 前提是要先设置响应格式
// response.writeHead(200 ,{	
// 	'Content-Type':'text/html',
// });

//判断客户端输入的网站地址,做出响应
// switch ( request.url ){   

// 	case '/':
// 	response.write('welcome');
   
// 	break;
	
// 	case '/reg':
// 	response.write('reg page');
//     response.write('<br /><input />');  
//     //就能正确显示文本框，不然就直接以字符串形式显示。
// 	break;

//     case '/post':
// 	response.write('post');
// 	break;

//     default:
//     response.writeHead(404);  //标准用法
// 	response.write('404');
// 	break;	

// }


// response.end();  //结束响应  不然客户端卡死

// });

//设置服务器的监听  参数第一个web服务器监听的端口号  第二个是个函数，启动web服务会调用这个函数
//服务会一直启动，这样才能保持WEB服务
//想要停止WEB服务，可以在终端按ctrl+c
//端口号可以自定义
// server.listen(80,()=>{

//     console.log('网络服务已启动');
// });