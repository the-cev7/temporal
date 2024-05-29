import { defineQuery } from '@temporalio/workflow';

export const taskQueueA = 'TRANSFER_MONEY_A_TASK_QUEUE';
export const taskQueueB = 'TRANSFER_MONEY_B_TASK_QUEUE';

export const getTransferQuery =
    defineQuery<Array<string | null>>('TransferMoney');
