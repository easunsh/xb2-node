import jwt from 'jsonwebtoken';
import { connection } from '../app/database/mysql';
import { PRIVATE_KEY } from '../app/app.config';

/**
 * 签发令牌给用户
 */
interface SignTokenOptions{
    payload?: any;
}

export const signToken = ( options: SignTokenOptions ) => {
    //准备选项
    const { payload } = options;

    /**
     * 要签发给用户的令牌
     * algorithm: 'RS256' 加密算法
     */
    const token = jwt.sign( payload , PRIVATE_KEY , { algorithm: 'RS256'} );

    //提供JWT
    return token;

};

/**
 * 检查用户是否拥有指定资源
 * 定义传入的类型 ，为一个临时定义的interface
 */
interface PossessOptions {
    resourceId: number;  // 例如 更新条目 post接口 更新第10条 
    resourceType: string;  //资源类型  例如 更新条目 post 接口功能
    userId: number;  // 例如 1， 当前token中的用户id
}

export const possess = async ( options: PossessOptions ) => {

    //准备解构选项
    const { resourceId , resourceType , userId } = options; 

    //准备查询 给统计结果的字段起一个别名COUNT
    const statment = `
        SELECT COUNT( ${ resourceType }.id ) as count
        FROM ${ resourceType }
        WHERE ${ resourceType }.id = ? AND userId = ?
    `;

    // SELECT COUNT( post.id ) as count FROM post WHERE post.id = 10 AND userId = 1
    // 显示1 条记录

    //检查拥有权
    const [data] = await connection
    .promise()
    .query( statment , [ resourceId , userId ] );

    //提供返回结果
    return data[0].count ? true: false;

};

