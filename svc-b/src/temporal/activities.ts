import { Injectable } from '@nestjs/common';
import { ITransfer, IOrder } from '../shared/types';

@Injectable()
export class Activities {
  constructor() {}

  async transferMoney(transfer: ITransfer): Promise<string> {
    const str: string = `\nTransfer $${transfer.amount} from user ${transfer.fromUser} to user ${transfer.toUser} ReferenceId: ${transfer.referenceID}\n`;
    console.log(str);

    return str;
  }

  async order(order: IOrder): Promise<boolean> {
    const str: string = `Order ID ${order.id} Success!`;
    console.log(str);

    return true;
  }
}
