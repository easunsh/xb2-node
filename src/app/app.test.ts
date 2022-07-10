import request from 'supertest';
import app from '../app';   //相当于 app/下的index
import { connection } from './database/mysql';




import { greet } from './playground/demo';

/**
 * 
 * 一个简单的单元测试
 */

describe('演示单元测试' , () =>{

    //测试
    test('测试greet 函数' , () => {

        //准备
        const greeting = greet('孙一');

        //断言
        //expect(greeting).toBe('hello');  //错误
        expect(greeting).toBe('您好,孙一');  //正确测试通过


    });


});


/**
 * 测试接口
 */

 describe('演示接口测试' , () =>{

    afterAll( async () => {
        //断开数据服务连接  不然会卡住
        connection.end();
    });

    //测试
    test('测试get/' , async () => {

        //请求接口
        const response = await request(app).get('/');

        //断言
    
        expect( response.status ).toBe(200);
        expect( response.body ).toEqual( { title: '小白兔开发之路'});
    });


    //第二个
    test('测试POST/ echo' , async () => {

        //请求接口
        const response = await request(app)
        .post('/echo')
        .send({ message: '你好~'});

        //断言
        expect( response.status ).toBe(201);
        expect( response.body ).toEqual( { message: '你好~'});
    });
  
});