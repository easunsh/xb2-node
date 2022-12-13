import { Request } from 'express';
import querystring, { stringify } from 'querystring';
import qs from 'qs';
import crypto from 'crypto';
import {
  WxpayPaymentResult,
  WxpayPrePayResult,
  WxpayOrder,
} from './wxpay.interface';
import {
  WXPAY_APP_ID,
  WXPAY_KEY,
  WXPAY_MCH_ID,
  APP_NAME,
  WXPAY_NOTIFY_URL,
  WXPAY_API_UNIFIEDORDER,
} from '../../app/app.config';

import {
  httpClient,
  logger,
  uid,
  xmlBuilder,
  xmlParser,
} from '../../app/app.service';
import { OrderModel } from '../../order/order.model';

/**
 * 微信支付：制作签名
 * 二个参数，
 * 1个是要签名的数据
 * 2 key是微信支付的密钥
 */
export const wxpaySign = async (
  data: WxpayOrder | WxpayPaymentResult,
  key: string,
) => {
  //1,制作签名，对签名数据进行排序
  const sortedData = Object.keys(data)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = data[key];
      return accumulator;
    }, {});

  //2,将签名数据转换为地址查询符
  const query = qs.stringify(sortedData, {
    encodeValuesOnly: true, // prettify URL
  });

  //3,在查询字符串中添加KEY，也就是密钥
  const stringDataWithKey = `${query}&key=${key}`;

  //4.MD5 后全部大写
  const sign = crypto
    .createHash('md5')
    .update(stringDataWithKey)
    .digest('hex')
    .toUpperCase();

  return sign;
};

/**
 * 微信支付：验证支付结果通知
 */
export const wxpayVerifyPaymentResult = async (
  paymentResult: WxpayPaymentResult,
) => {
  const { sign } = paymentResult;
  delete paymentResult['sign'];

  const selfSign = await wxpaySign(paymentResult, WXPAY_KEY);
  const isValidSign = sign === selfSign;
  return isValidSign;
};

/**
 * 微信支付
 */
export const wxpay = async (order: OrderModel, request: Request) => {
  //公众账号ID
  const appid = WXPAY_APP_ID;
  //微信支付商户号
  const mch_id = WXPAY_MCH_ID;
  //订单号
  const out_trade_no = `${uid()}_${order.id}`;

  //商品ID
  const product_id = order.productId;

  //商品描述
  const body = `${APP_NAME}#${order.id}`;

  //订单金额
  const total_fee = Math.round(order.totalAmount * 100);

  //支付类型 扫码支付
  const trade_type = 'NATIVE';

  //通知地址
  const notify_url = WXPAY_NOTIFY_URL;

  //随机字符
  const nonce_str = uid();

  //附加数据
  const socketId = (request.headers['x-socket-id'] ||
    request.headers['X-Socket-Id']) as string;

  const attach = socketId || 'NULL';

  //订单
  const wxpayOrder = {
    appid,
    mch_id,
    out_trade_no,
    product_id,
    body,
    total_fee,
    trade_type,
    notify_url,
    nonce_str,
    attach,
  };

  //签名
  const sign = wxpaySign(wxpayOrder, WXPAY_KEY);

  const wxpayOrderXml = xmlBuilder.buildObject({
    ...wxpayOrder,
    sign,
  });

  //统一下单
  const response = await httpClient.post(WXPAY_API_UNIFIEDORDER, wxpayOrderXml);

  const { xml: prepayResult } = await xmlParser.parseStringPromise(
    response.data,
  );

  logger.debug('微信支付统一下单结果', prepayResult);

  if (prepayResult.return_code === 'FAIL') {
    throw new Error(prepayResult.return_msg);
  }

  return prepayResult as WxpayPrePayResult;
};
