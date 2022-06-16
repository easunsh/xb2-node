import dotenv from 'dotenv';
dotenv.config(); //会载入.env这个文件

//应用配置
export const { APP_PORT } = process.env;
//Mysql
export const { 
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
 } = process.env;

 //公钥密钥配置
 export let { PRIVATE_KEY , PUBLIC_KEY }  = process.env;
 //解码一下把BASE64格式转化成原来的样子，还原
 PRIVATE_KEY = Buffer.from( PRIVATE_KEY , 'base64').toString();
 PUBLIC_KEY = Buffer.from( PUBLIC_KEY , 'base64').toString();

