import { CancelledFailure } from '@temporalio/activity';
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
    try {
      const str: string = `Order ID ${order.id}, Price +${order.price}  Success!`;
      console.log(str);
    } catch (err) {
      if (err instanceof CancelledFailure) {
        console.log(`Order ID ${order.id} cancelled`, { message: err.message });
        // Cleanup
      }
      throw err;
    }

    return true;
  }

  async clearOrder(order: IOrder): Promise<void> {
    const str: string = `Compensation Order ID ${order.id}, Price -${order.price} Success!`;
    console.log(str);
  }
}
