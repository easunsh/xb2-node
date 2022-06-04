const http = require('http');  //通过 http使用里面的功能

//模拟服务器端
//request请求 和 response响应名字可自定义，但顺序不能错，可能req ,res
const server = http.createServer(( request,response) =>{


//客户端设置JSON去响应

let data = {
	"id":1,
	"title":'sunyi',
	"content":'hahhahahaha'	

}

//转换
let jsonData = JSON.stringify(data);

response.writeHead(200,{
	
	'Content-Type':'application/json;carset=utf-8'

});

response.write(jsonData);


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


response.end();  //结束响应

});

//设置服务器的监听  参数第一个web服务器监听的端口号  第二个是个函数，启动web服务会调用这个函数
//服务会一直启动，这样才能保持WEB服务
//想要停止WEB服务，可以在终端按ctrl+c
//端口号可以自定义
server.listen(80,()=>{

    console.log('网络服务已启动');
});