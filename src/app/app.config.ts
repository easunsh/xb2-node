import dotenv from 'dotenv';
dotenv.config(); //会载入.env这个文件

//应用配置
export const { APP_PORT, APP_NAME, APP_NAME_ALIAS } = process.env;

//跨域资源共享的配置
export const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN;

//Mysql
export const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

//公钥密钥配置
export let { PRIVATE_KEY, PUBLIC_KEY } = process.env;
//解码一下把BASE64格式转化成原来的样子，还原
PRIVATE_KEY = Buffer.from(PRIVATE_KEY, 'base64').toString();
PUBLIC_KEY = Buffer.from(PUBLIC_KEY, 'base64').toString();

/**
 * 内容分页配置
 */
//export const { POSTS_PER_PAGE } = process.env;
export const POSTS_PER_PAGE = parseInt(process.env['POSTS_PER_PAGE'], 10);

/**
 * 评论分页参数配置
 */
export const COMMENTS_PER_PAGE = parseInt(process.env['COMMENTS_PER_PAGE'], 10);

/**
 * 订单列表参数配置
 */
export const ORDERS_PER_PAGE = parseInt(process.env['ORDERS_PER_PAGE'], 10);

/**
 * 微信登录，网站应用
 */
export const {
  WEIXIN_API_BASE_URL,
  WEIXIN_WEBSITE_APP_ID,
  WEIXIN_WEBSITE_APP_SECRET,
} = process.env;

/**
 * 许可
 */
export const LICENSE_PER_PAGE = parseInt(process.env['LICENSES_PER_PAGE'], 10);

/**
 * 订阅
 */
export const STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK = parseInt(
  process.env['STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK'],
  10,
);

/**
 * 日期时间
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 微信支付
 */
export const {
  WXPAY_APP_ID,
  WXPAY_MCH_ID,
  WXPAY_KEY,
  WXPAY_API_UNIFIEDORDER,
  WXPAY_API_ORDERQUERY,
  WXPAY_NOTIFY_URL,
} = process.env;

/**
 * 支付宝
 */
export const {
  ALIPAY_APP_ID,
  ALIPAY_NOTIFY_URL,
  ALIPAY_RETURN_URL,
  ALIPAY_GATEWAY,
  ALIPAY_WAP_PAY_BASE_URL,
} = process.env;

export let { ALIPAY_PUBLIC_KEY, ALIPAY_APP_PRIVATE_KEY } = process.env;

ALIPAY_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\n' +
  ALIPAY_PUBLIC_KEY +
  '\n-----END PUBLIC KEY-----';

ALIPAY_APP_PRIVATE_KEY =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  ALIPAY_APP_PRIVATE_KEY +
  '\n-----END RSA PRIVATE KEY-----';
