export enum OrderLogAction {
  orderCreated = 'orderCreated',
  orderUpdate = 'orderUpdated',
  orderStatusChanged = 'orderStatusChanged',
  orderPaymentRecived = 'orderPaymentRecived',
}

export class OrderLogModel {
  id?: number;
  userId?: number;
  orderId?: number;
  action?: OrderLogAction;
  meta?: any;
  created?: string;
}
