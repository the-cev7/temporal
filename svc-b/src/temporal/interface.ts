import { IPayment } from '../shared/types';

export interface PaymentActivityInterface {
  payment(payment: IPayment): Promise<void>;
  revertPayment(payment: IPayment): Promise<void>;
  notifyPayment(payment: IPayment): Promise<void>;
  revertNotifyPayment(payment: IPayment): Promise<void>;
}
