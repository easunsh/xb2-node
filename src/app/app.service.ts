import { WEIXIN_API_BASE_URL } from './app.config';
import axios from 'axios';

/**
 * HTTP客户端微信
 */
export const weixinApiHttpClient = axios.create({
  baseURL: WEIXIN_API_BASE_URL,
});

/**
 * HTTP客户端
 */
export const httpClient = axios.create();
