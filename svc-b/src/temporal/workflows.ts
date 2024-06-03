import { proxyActivities, defineQuery, setHandler } from '@temporalio/workflow';
import type { Activities } from './activities';
import { ITransfer, IOrder } from '../shared/types';

const isOrderQuery = defineQuery<boolean>('isOrder');

const {
  transferMoney,
  order,
  // cancellableFetch  // todo: demo usage
} = proxyActivities<Activities>({
  retry: {
    initialInterval: '50 milliseconds',
    maximumAttempts: 2,
  },
  startToCloseTimeout: '30 seconds',
});

export async function transferWorkflow(transfer: ITransfer): Promise<string> {
  const rs: string = await transferMoney(transfer);

  return rs;
  // return rsB
  // TODO check results
}


export async function orderWorkflow(data: IOrder): Promise<void> {
  let isOrder: boolean = false
  setHandler(isOrderQuery, () => isOrder);
  await new Promise(f => setTimeout(f, 60000));
  isOrder = await order(data);
}
