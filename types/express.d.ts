import { TokenPayload } from '../src/auth/auth.interface' ;

/**
 * 扩展REQUEST，要往里面添加新的属性
 * 声明一个global 当中有一个命名空间叫Express
 * 导出一个interface　名字叫Request，添加需要的新属性
 * user 类型为 TokenPayload 
 */

declare global {
    namespace Express {
        export interface Request {
            user: TokenPayload;
            fileMetaData: { width?: number; height?: number; metadata?: {} }
        }

    }

}