import { proxyActivities, setHandler } from '@temporalio/workflow';
import { ITransferActivity } from './activities';
import { ITransfer } from '../shared/types';
import { getTransferQuery } from '../shared/constants';

const {
    TransferMoneyA,
    transferMoneyB,
    // cancellableFetch  // todo: demo usage
} = proxyActivities<ITransferActivity>({
    retry: {
        initialInterval: '50 milliseconds',
        maximumAttempts: 2,
    },
    startToCloseTimeout: '30 seconds',
});

export async function transferWorkflowA(transfer: ITransfer): Promise<void> {
    const rs: Array<string | null> = await TransferMoneyA(transfer);

    // TODO check results
    setHandler(getTransferQuery, () => rs);
}

export async function transferWorkflowB(transfer: ITransfer): Promise<void> {
    const rs: Array<string | null> = await transferMoneyB(transfer);

    // TODO check results
    setHandler(getTransferQuery, () => rs);
}
