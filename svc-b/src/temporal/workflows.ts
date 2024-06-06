import {
  proxyActivities,
  defineQuery,
  setHandler,
  defineSignal,
  isCancellation,
  Trigger,
} from '@temporalio/workflow';
import type { Activities } from './activities';
import { IOrder, ICompensation, IPayment } from '../shared/types';
import { taskQueuePayment } from '../shared/constants';
import { compensate } from './compensations';
import { PaymentActivityInterface } from './interface';

const isOrderQuery = defineQuery<boolean>('isOrder');
const exitWFSignal = defineSignal('exit');
const paymentSignal = defineSignal<[IPayment]>('payment');

const { order, revertOrder, notifyOrder, revertNotifyOrder } =
  proxyActivities<Activities>({
    retry: {
      maximumAttempts: 2,
    },
    startToCloseTimeout: '30s',
    heartbeatTimeout: '10s',
  });

// Activities Interface from outside worker [svc_c payment worker]
const { payment, revertPayment, notifyPayment, revertNotifyPayment } =
  proxyActivities<PaymentActivityInterface>({
    taskQueue: taskQueuePayment, // use task queue from svc_c worker
    retry: {
      maximumAttempts: 2,
    },
    startToCloseTimeout: '30s',
    heartbeatTimeout: '10s',
  });

export async function orderWorkflow(data: IOrder): Promise<void> {
  const compensations: ICompensation[] = [];
  const exited = new Trigger<void>();
  const triggerPayment = new Trigger<void>();

  try {
    // Flow order step
    let isOrder: boolean = false;
    setHandler(isOrderQuery, () => isOrder);
    await new Promise((f) => setTimeout(f, 10000));
    isOrder = await order(data);
    // successfully called, so clear if a failure occurs later
    compensations.unshift({
      message: 'reversing order',
      fn: () => revertOrder(data),
    });
    await notifyOrder(data);
    compensations.unshift({
      message: 'reversing order',
      fn: () => revertNotifyOrder(data),
    });

    // Flow payment step
    setHandler(paymentSignal, async (dataP: IPayment) => {
      try {
        await payment(dataP);
        // successfully called, so clear if a failure occurs later
        compensations.unshift({
          message: 'reversing payment',
          fn: () => revertPayment(dataP),
        });
        await notifyPayment(dataP);
        // successfully called, so clear if a failure occurs later
        compensations.unshift({
          message: 'reversing payment',
          fn: () => revertNotifyPayment(dataP),
        });

        triggerPayment.resolve();
      } catch (err) {
        triggerPayment.reject(err);
      }
    });

    // Flow shipping step
    // TODO

    setHandler(exitWFSignal, () => {
      exited.resolve();
    });

    await triggerPayment;
    await exited;
  } catch (err) {
    console.log('Workflow comein');
    if (isCancellation(err)) {
      console.log('Workflow cancelled along with its activity');
    } else {
      await compensate(compensations);
      throw err;
    }
  }
}
