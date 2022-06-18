/**
 * 处理KEY的JS ，转成BASE64格式
 */
const fs = require('fs');  // 导入FS模块
const path = require('path');  //组织文件的路径

/**
 * 读取密钥文件
 * readFileSync去同步的读取一个文件
 *  path.join 组织路径
 */
const privateKey = fs.readFileSync( path.join('config' , 'private.key'));
const publicKey = fs.readFileSync( path.join('config' , 'public.key'));

/**
 * 转换成为BASE64 格式
 */
const privateKeyBase64 = Buffer.from(privateKey).toString('base64');
const publicKeyBase64 = Buffer.from(publicKey).toString('base64');

/**
 * 输出转换结果
 */
console.log('\nPrivate Key:');
console.log( privateKeyBase64 );

console.log('\nPublic Key:');
console.log( publicKeyBase64 );