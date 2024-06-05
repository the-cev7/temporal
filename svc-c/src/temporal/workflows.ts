import { proxyActivities } from '@temporalio/workflow';
import type { Activities } from './activities';
import { IPayment, ICompensation } from '../shared/types';
import { compensate } from './compensations';

const {
  payment,
  clearPayment,
  // cancellableFetch  // todo: demo usage
} = proxyActivities<Activities>({
  retry: {
    initialInterval: '50 milliseconds',
    maximumAttempts: 2,
  },
  startToCloseTimeout: '30 seconds',
});

export async function paymentWorkflow(data: IPayment): Promise<void> {
  const compensations: ICompensation[] = [];
  try {
    await payment(data);
    // successfully called, so clear if a failure occurs later
    compensations.unshift({
      message: 'reversing payment',
      fn: () => clearPayment(data),
    });
  } catch (err) {
    await compensate(compensations);
    throw err;
  }
}
