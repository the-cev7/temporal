import {
  proxyActivities,
  defineQuery,
  setHandler,
  defineSignal,
  isCancellation,
  CancellationScope,
  Trigger,
} from '@temporalio/workflow';
import type { Activities } from './activities';
import { ITransfer, IOrder, ICompensation } from '../shared/types';
import { compensate } from './compensations';

const isOrderQuery = defineQuery<boolean>('isOrder');
const exitSignal = defineSignal('exit');

const {
  transferMoney,
  order,
  clearOrder,
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
}

export async function orderWorkflow(data: IOrder): Promise<void> {
  const compensations: ICompensation[] = [];
  const exited = new Trigger<void>();

  try {
    let isOrder: boolean = false;
    setHandler(isOrderQuery, () => isOrder);
    await new Promise((f) => setTimeout(f, 10000));
    isOrder = await order(data);
    // successfully called, so clear if a failure occurs later
    compensations.unshift({
      message: 'reversing order',
      fn: () => clearOrder(data),
    });
    setHandler(exitSignal, () => {
      exited.resolve();
    });
    await exited;
  } catch (err) {
    if (isCancellation(err)) {
      console.log('Workflow cancelled along with its activity');
      await CancellationScope.nonCancellable(() => clearOrder(data));
      throw err;
    }
    await compensate(compensations);
    throw err;
  }
}
