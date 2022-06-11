import dotenv from 'dotenv';
dotenv.config(); //会载入.env这个文件

//应用配置
export const { APP_PORT } = process.env;