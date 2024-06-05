import { Injectable } from '@nestjs/common';
import { IPayment } from '../shared/types';

@Injectable()
export class Activities {
  constructor() {}

  async payment(payment: IPayment): Promise<void> {
    // switch enable
    if (payment.failed) {
      throw new Error('Fake error')
    }
    const str: string = `Payment ID ${payment.id}, Price +${payment.price} Success!`;
    console.log(str);
  }

  async clearPayment(payment: IPayment): Promise<void> {
    const str: string = `Compensation Payment ID ${payment.id}, Price -${payment.price} Success!`;
    console.log(str);
  }
}
