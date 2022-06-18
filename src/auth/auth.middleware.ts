import { Request,Response,NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';   //对比密码用里面的功能 ，对比HASH过的
import jwt from 'jsonwebtoken';  //令牌功能
import { PUBLIC_KEY } from '../app/app.config'; //令牌功能
import { TokenPayload } from './auth.interface';

/**
 * 验证用户登录数据的中间件
 */
 export const validateLoginData = async (
    request:　Request,
    response: Response,
    next: NextFunction

) => {

    console.log('验证用户的登录数据');
    
    //获得请求来的数据
    const { name , password } = request.body; 
    //验证必填数据
    if (!name) return next ( new Error('NAME_IS_REQUIRED')); 
    if (!password) return next ( new Error('PASSWORD_IS_REQUIRED')); 

    //验证用户名是否存在
    const user = await userService.getUserByName(name, { password : true } );
    if (!user) return next( new Error('USER_DOES_NOT_EXIST') );


    //验证用户密码 ，对比用户提供的密码对比数据库中的HASH过的密码,返回true or false
    const matched = await bcrypt.compare( password , user.password );

    //返回密码不匹配
    if (!matched) return next( new Error('PASSWORD_DOES_NOT_MATCH'));


    //在请求主体里添加用户,查询出来的用户
    request.body.user = user;


    //下一步
    next();
};

/**
 * 用令牌验证用户身份
 */

export const authCuard = (
    request:　Request,
    response: Response,
    next: NextFunction
) => {
    console.log('验证用户身份');

    try {

        const authorization = request.header('Authorization');
        
        if(!authorization) throw new Error();

//提取 JWT令牌
//客户端会把这个令牌存储起来， 放在 Authorization 的头部数据
//对应的值是 Bearer空格对应的令牌值，请求服务端时候，会发送这个Bearer的值，
//服务端会进行验证。
        const token = authorization.replace('Bearer ','');  // Bearer空格，空格漏了会报错   
        if(!token) throw new Error();
        //console.log('token is' + token);

        console.log(PUBLIC_KEY);

    //验证令牌 重要一步 decoded 里是用户的ID NAME 签发时间
    const decoded =  jwt.verify(token , PUBLIC_KEY, {

        algorithms: ['RS256'],

    });


    /**
     * 在请求里添加当前用户
     * request.user的属性是TokenPayload ,decoded 是string
     * 用AS 进行转化，把decoded 看作是TokenPayload
     */

    request.user = decoded as TokenPayload;


    //下一步
    next();

    } catch( error ){

        //console.log("***********"+error);

        next( new Error('UNAUTHORIZED') );
    }
};