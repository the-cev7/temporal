import { proxyActivities } from '@temporalio/workflow';
import type { Activities } from './activities';
import { ITransfer } from '../shared/types';

const {
  transferMoney,
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
