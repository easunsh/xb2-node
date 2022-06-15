import { Request,Response,NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';   //对比密码用里面的功能 ，对比HASH过的


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

    //下一步
    next();
};