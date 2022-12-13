/**
 * 微信支付订单
 */
export interface WxpayOrder {
  appid: string;
  mch_id: string;
  out_trade_no: string; //交易号
  product_id: number;
  body: string; //产品描述
  total_fee: number; //产品价格
  trade_type: string; //交易类型
  spbill_create_ip?: string;
  notify_url: string; //支付结果通知地址
  nonce_str: string; //随机的字符串
  sign?: string;
  attach?: string;
}

/**
 * 微信支付结果通知
 */
export interface WxpayPaymentResult {
  appid: string;
  bank_type: string;
  cash_fee: number;
  fee_type: string;
  is_subscribe: string;
  mch_id: string;
  nonce_str: string;
  openid?: string;
  out_trade_no: string;
  result_code: string;
  return_code: string;
  sign: string;
  time_end: string;
  total_fee: number;
  trade_type: string;
  transaction_id: string;
}

/**
 * 微信支付预支付结果
 */
export interface WxpayPrePayResult {
  return_code: string;
  return_msg: string;
  appid?: string;
  mch_id?: string;
  nonce_str?: string;
  sign?: string;
  result_code?: string;
  prepay_id?: string;
  trade_type?: string;
  code_url?: string;
}
