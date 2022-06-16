import { Request,Response,NextFunction } from 'express';
import * as userService from './user.service';
import bcrypt from 'bcrypt';

/**
 * 验证用户数据的中间件
 */
export const validateUserData = async (
    request:　Request,
    response: Response,
    next: NextFunction

) => {

    console.log('验证用户数据');
    
    //获得请求来的数据
    const { name , password } = request.body; 
    //验证必填数据
    if (!name) return next ( new Error('NAME_IS_REQUIRED')); 
    if (!password) return next ( new Error('PASSWORD_IS_REQUIRED')); 

    //验证用户名是否存在
    const user = await userService.getUserByName(name);
    if (user) return next( new Error('USER_ALREADY_EXIST') );
    //下一步
    next();
};

/**
 * HASH 密码
 */
export const hashPassword = async(
    request:　Request,
    response: Response,
    next: NextFunction
) => {
    //准备数据 解构
    const { password } = request.body;

    //HASH 密码 传入用户的密码，10为强度
    request.body.password = await bcrypt.hash( password,10 );
    //下一步
    next();

};