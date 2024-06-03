import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import {
  WorkflowClient,
  WorkflowExecutionAlreadyStartedError,
} from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';

import { taskQueuePayment } from './shared/constants';
import { IStorePaymentDto } from './shared/types';

@Controller('/payments')
export class PaymentController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async postPayment(@Body() data: IStorePaymentDto): Promise<{
    status: number;
    paymentId: string;
  }> {

    const id: string = (Math.random() + 1).toString(36).substring(2);
    // Create payment from request
    const payment: IStorePaymentDto = { ...data };
    payment.id = id;

    const handleOrder = this.temporalClient.getHandle('wf-order-id-' + data.orderId);
    const orderStatus = await handleOrder.query('isOrder');

    if (!orderStatus) {
      return {
        status: 400,
        paymentId: payment.id
      }
    }

    // Register workflows
    const handle = await this.temporalClient.start('paymentWorkflow', {
      args: [payment],
      taskQueue: taskQueuePayment,
      workflowId: 'wf-payment-id-' + id,
    });

    console.log(`Started workflow payment ${handle.workflowId}`);

    return {
      status: 200,
      paymentId: payment.id
    }
  }
}
