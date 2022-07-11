import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app';
import { connection } from '../app/database/mysql';
import { signToken } from '../auth/auth.service';
import { deleteUser , getUserById } from './user.service';
import { UserModel } from './user.model';

/**
 * 相当于模拟客户端软件
 * 准备测试
 * 测试的时候会创建一个用户走一下流程
 * testUser就是要创建的测试用户
 * testUserUpdated 测试更新用户接口用到它 里面是更新的用户数据
 * testUserCreated 接收用户创建后的数据
 */

const testUser: UserModel = {
    name: 'xb2-test-user-name',
    password: '111111',
};

const testUserUpdated: UserModel = {
    name: 'xb2-test-user-new-name',
    password: '222222',
};

let testUserCreated: UserModel;

/**
 * 所有测试结束后
 * 删除掉测试的用户
 * 并断开数据库的链接
 */

afterAll( async() => {

    //删除测试用户 ,如果创建好了，就删除
    if( testUserCreated ) {

        await deleteUser( testUserCreated.id );
    }

    //断开数据服务连接
    connection.end()


});


/**
* 创建用户流程测试
*/
describe('测试创建用户接口' , () =>{
    test('创建用户时必须提供用户名' , async () => {
    //请求接口
    const response = await request(app)
    .post('/users')
    .send( { password: testUser.password } );
    //断言 收到response
    expect( response.status ).toBe( 400 );
    expect( response.body ).toEqual( { message: '请提供用户名'} );
    });

    test('创建用户时必须提供密码' , async () => {
        //请求接口
        const response = await request(app)
        .post('/users')
        .send( { name: testUser.name } );
        //断言
        expect( response.status ).toBe( 400 );
        expect( response.body ).toEqual( { message: '请提供密码'} );
        });

    test('成功创建用户以后，响应码应该是201' , async () => {
            //请求接口 保存创建的测试用户
            const response = await request(app)
            .post('/users')
            .send( testUser );

            //看一下是否保存成功
            testUserCreated = await getUserById(
                response.body.insertId,
                { password: true,}
            );
            
           //做出断言
           expect( response.status ).toBe( 201 );
           
        });

});


/**
* 自动测试用户更新
*/
describe('测试更新用户接口' , () =>{

    test('更新用户数据时需要验证用户身份' , async () => {
    //请求接口
    const response = await request(app)
    .patch('/users');
    //断言
    expect( response.status ).toBe( 401 );

    });

    test('更新用户数据' , async () => {
        //签发令牌
        const token = signToken({

            payload: { 
                id: testUserCreated.id , 
                name: testUserCreated.name
            },

        });

        const response = await request(app)
        .patch('/users')
        .set('Authorization' , `Bearer ${token}`)
        .send({
            validate: {
                password: testUser.password,
            },
            update: {
                name: testUserUpdated.name,
                password: testUserUpdated.password,
            }

        });

        //调取用户 password: true 读数据库时会把pwd 一起查出来
        const user = await getUserById( 
            testUserCreated.id ,
            { password: true }
        );

        //对比密码
        const matched = await bcrypt.compare(
            testUserUpdated.password,
            user.password,

        );

        //断言
        expect( response.status ).toBe( 200 );
        expect( matched ).toBeTruthy();
        expect( user.name ).toBe( testUserUpdated.name );

    
        });

});
