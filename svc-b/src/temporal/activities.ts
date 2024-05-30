import { Injectable } from '@nestjs/common';
import { ITransfer } from '../shared/types';

@Injectable()
export class Activities {
  constructor() {}

  async transferMoney(transfer: ITransfer): Promise<string> {
    const str: string = `\nTransfer $${transfer.amount} from user ${transfer.fromUser} to user ${transfer.toUser} ReferenceId: ${transfer.referenceID}\n`;
    console.log(str);

    return str;
  }
}
