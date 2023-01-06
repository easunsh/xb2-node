import { Request } from 'express';
import querystring, { stringify } from 'querystring';
import crypto, { sign } from 'crypto';
import dayjs from 'dayjs';
import {
  ALIPAY_NOTIFY_URL,
  ALIPAY_RETURN_URL,
  DATE_TIME_FORMAT,
  APP_NAME,
  ALIPAY_APP_ID,
  ALIPAY_APP_PRIVATE_KEY,
  ALIPAY_GATEWAY,
  ALIPAY_WAP_PAY_BASE_URL,
  ALIPAY_PUBLIC_KEY,
} from '../../app/app.config';
import { uid } from '../../app/app.service';
import { AlipayMethod, AlipayRequestParams } from './alipay.interface';
import { OrderModel } from '../../order/order.model';
import qs from 'qs';
import { createPaymentUrl } from '../../payment-url/payment-url.service';

/**
 * 支付宝；请求参数
 */

export const alipayRequestParams = async (
  order: OrderModel,
  method: AlipayMethod,
  request: Request,
) => {
  //应用ID
  const app_id = ALIPAY_APP_ID;

  //编码格式
  const charset = 'utf-8';

  //签名算法
  const sign_type = 'RSA2';

  //请求时间
  const timestamp = dayjs().format(DATE_TIME_FORMAT);

  //接口版本
  const version = '1.0';

  //通知地址
  const notify_url = ALIPAY_NOTIFY_URL;

  //返回地址
  const return_url = ALIPAY_RETURN_URL;

  //订单号
  const out_trade_no = `${uid()}_${order.id}`;

  //订单金额
  const total_amount = order.totalAmount;

  //商品标题
  const subject = `${APP_NAME}#${order.id}`;

  //公用回传
  const socketId = (request.headers['x-socket-id'] ||
    request.headers['X-Socket-Id']) as string;

  const passback_params = socketId || 'NULL';

  //产品代码
  let product_code: string;

  switch (method) {
    case AlipayMethod.page:
      product_code = 'FAST_INSTANT_TRADE_PAY';
      break;

    case AlipayMethod.wap:
      product_code = 'QUICK_WAP_WAY';
      break;
  }

  //参数集合
  const biz_content = JSON.stringify({
    out_trade_no,
    total_amount,
    subject,
    passback_params,
    product_code,
  });

  //请求参数
  const requestParams: AlipayRequestParams = {
    app_id,
    charset,
    sign_type,
    timestamp,
    version,
    method,
    notify_url,
    return_url,
    biz_content,
  };

  return requestParams;
};

/**
 * 支付宝：签名预处理
 */
export const alipayPreSign = (data: AlipayRequestParams) => {
  //排序 sort
  //用reduce 去生成一个对象
  //传入回调函数，2个参数，accumulator和 KEY ， 初始值是一个空白对象{}
  const sortedData = Object.keys(data)
    .sort()
    .reduce((accumulator, key) => {
      const itemValue = data[key].trim();

      if (!itemValue) return accumulator;

      accumulator[key] = itemValue;

      return accumulator;
    }, {});

  //查询符处理
  const dataString = qs.stringify(sortedData, {
    encodeValuesOnly: true, // prettify URL
  });

  return dataString;
};

/**
 * 支付宝：签名
 */
export const alipaySign = (data: AlipayRequestParams) => {
  const dataString = alipayPreSign(data);

  const sign = crypto
    .createSign('sha256')
    .update(dataString)
    .sign(ALIPAY_APP_PRIVATE_KEY, 'base64');

  return sign;
};

/**
 * 支付宝：支付地址
 */
export const alipayRequestUrl = (
  requestParams: AlipayRequestParams,
  sign: string,
) => {
  const requestParamsString = qs.stringify(
    { ...requestParams, sign },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  const requestUrl = `${ALIPAY_GATEWAY}?${requestParamsString}`;

  return requestUrl;
};

/**
 * 支付宝
 */
export const alipay = async (order: OrderModel, request: Request) => {
  //请求参数
  const pagePayRequestParams = await alipayRequestParams(
    order,
    AlipayMethod.page,
    request,
  );

  const wapPayRequestParams = await alipayRequestParams(
    order,
    AlipayMethod.wap,
    request,
  );

  //签名
  const pagePaySign = alipaySign(pagePayRequestParams);
  const wapPaySign = alipaySign(wapPayRequestParams);

  //请求地址
  const pagePayRequestUrl = alipayRequestUrl(pagePayRequestParams, pagePaySign);
  const wapPayRequestUrl = alipayRequestUrl(wapPayRequestParams, wapPaySign);

  //随机字符
  const token = uid();

  //支付地址
  await createPaymentUrl({
    orderId: order.id,
    token,
    url: wapPayRequestUrl,
  });

  const paymentUrl = `${ALIPAY_WAP_PAY_BASE_URL}/payment-url?token=${token}`;

  return {
    pagePayRequestUrl,
    paymentUrl,
  };
};

/**
 * 支付宝，验证支付结果
 */
export const alipayVerifyPaymentResult = (data: any) => {
  const { sign } = data;
  delete data.sign;
  delete data.sign_type;

  const dataString = alipayPreSign(data);

  const result = crypto
    .createVerify('sha256')
    .update(dataString)
    .verify(ALIPAY_PUBLIC_KEY, sign, 'base64');

  return result;
};
