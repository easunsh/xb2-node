import { Request,Response,NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';   //对比密码用里面的功能 ，对比HASH过的
import jwt from 'jsonwebtoken';  //令牌功能
import { PUBLIC_KEY } from '../app/app.config'; //令牌功能
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';  //验证权限

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
 * @return 用令牌验证用户身份
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


/**
 * 访问控制
 * 
 */

interface AccessControlOptions {
    possession?: boolean;
}

/**
 * accessControl 方法
 * 配合 authCuard 一起使用 放在authCuard的后面，就能得到当前用户相关的数据
 * @param options 
 * @returns 
 */
export const accessControl  = ( options: AccessControlOptions ) => {
    
    return async (
        request:　Request,
        response: Response,
        next: NextFunction
    ) => {

        console.log('访问控制');

        //解构选项
        const { possession } = options;

        //当前用户ID  前提 accessControl 放在 authCuard 后使用
        const { id: userId } = request.user;

        //放行管理员
        if ( userId == 1) return next();

        //准备资源
        //resourceIdParam 为请求的 id 值，
        //请求参数中的request.params 为对象，Object.keys 截取出来，
        //比如是POST功能，，例 xb2_api/posts/10 , resourceIdParam 值为 postId
        const resourceIdParam = Object.keys( request.params )[0];

        //以上例子 xb2_api/posts/10  ， postId 去掉 Id,值为post
        const resourceType = resourceIdParam.replace('Id','');  

         // 以上例子 request.params[postId], 值为10
        const resourceId = parseInt( request.params[resourceIdParam] , 10 );  


        //postId&post&10
         console.log("resourceIdParam/" + resourceIdParam + "***"+"resourceType/" + resourceType + "***"+"resourceId/" + resourceId + "***"+"userId/" + userId );

        /**
         * 检查资源拥有权
         * 如果 possession 在router中设置成了true
         */
        if ( possession ) {

            try{

                const ownResource = await possess( { resourceId , resourceType , userId } );

                if( !ownResource ){
                    return next( new Error('USER_DOSE_NOT_OWN_RESOURCE') )
                }

            } catch (error) {

                return next(error);

            }
        }

    };

};