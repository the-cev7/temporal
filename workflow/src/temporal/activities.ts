import { ITransfer } from '../shared/types';

// @@@SNIPSTART typescript-hello-activity
export interface ITransferActivity {
    TransferMoneyA(transfer: ITransfer): Promise<Array<string | null>>;
    transferMoneyB(transfer: ITransfer): Promise<Array<string | null>>;
}
// @@@SNIPEND
