import { Injectable } from '@nestjs/common';
import { IPayment } from '../shared/types';

@Injectable()
export class Activities {
  constructor() {}

  async payment (payment: IPayment): Promise<void> {
    const str: string = `Payment ID ${payment.id} Success!`;
    console.log(str);
  }
}
