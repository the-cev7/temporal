import { proxyActivities } from '@temporalio/workflow';
import type { Activities } from './activities';
import { IPayment } from '../shared/types';

const {
  payment,
  // cancellableFetch  // todo: demo usage
} = proxyActivities<Activities>({
  retry: {
    initialInterval: '50 milliseconds',
    maximumAttempts: 2,
  },
  startToCloseTimeout: '30 seconds',
});

export async function paymentWorkflow(data: IPayment): Promise<void> {
  await payment(data);
}
