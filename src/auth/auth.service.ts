import jwt from 'jsonwebtoken';
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