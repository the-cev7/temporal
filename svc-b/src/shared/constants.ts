import { defineQuery } from '@temporalio/workflow';

export const taskQueue = 'TRANSFER_MONEY_B_TASK_QUEUE';

export const getTransferQuery =
    defineQuery<Array<string | null>>('TransferMoney');
