const http = require('http');  //通过 http使用里面的功能

//request 和 response名字可自定义，但顺序不能错，可能req ,res
const server = http.createServer(( request,response) =>{

response.write('hello~');  //响应一行文字，会在localhost网页中显示
response.end();  //结束响应

});

//设置服务器的监听  参数第一个web服务器监听的端口号  第二个是个函数，启动web服务会调用这个函数
//服务会一直启动，这样才能保持WEB服务
//想要停止WEB服务，可以在终端按ctrl+c
server.listen(3000,()=>{

    console.log('网络服务已启动');
});