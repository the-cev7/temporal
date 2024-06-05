import { Activities } from './temporal/activities';
import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueuePayment } from './shared/constants';

export const paymentWorkerProviders = [
  {
    provide: 'TRANSFER_WORKER',
    inject: [Activities],
    useFactory: async (activitiesService: Activities) => {
      const activities = {
        payment: activitiesService.payment.bind(activitiesService),
        clearPayment: activitiesService.clearPayment.bind(activitiesService),
      };

      const connection = await NativeConnection.connect({
        address: 'temporal:7233',
        // TLS and gRPC metadata configuration goes here.
      });

      const worker = await Worker.create({
        connection,
        taskQueue: taskQueuePayment,
        activities,
        workflowsPath: require.resolve('./temporal/workflows'),
      });

      await worker.run();
      console.log('Started worker!');

      return worker;
    },
  },
];
