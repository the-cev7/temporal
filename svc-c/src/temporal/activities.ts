import { Injectable } from '@nestjs/common';
import { IPayment } from '../shared/types';
import { heartbeat } from '@temporalio/activity';

@Injectable()
export class Activities {
  constructor() {}

  async payment(payment: IPayment): Promise<void> {
    const str: string = `[Payment] ID ${payment.id}, Price +${payment.price} Success!`;
    console.log(str);
    heartbeat();
  }

  async revertPayment(payment: IPayment): Promise<void> {
    const str: string = `[Revert Payment] ID ${payment.id}, Price -${payment.price} Success!`;
    console.log(str);
    heartbeat();
  }

  async notifyPayment(payment: IPayment): Promise<void> {
    // switch enable
    if (payment.failed) {
      throw new Error('Fake error');
    }
    const str: string = `[Notification] Payment ID ${payment.id}, Price +${payment.price} Success!`;
    console.log(str);
    heartbeat();
  }

  async revertNotifyPayment(payment: IPayment): Promise<void> {
    const str: string = `[Revert Notification] Payment ID ${payment.id}, Price -${payment.price} Success!`;
    console.log(str);
    heartbeat();
  }
}
