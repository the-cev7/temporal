import { Activities } from './temporal/activities';
import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueue } from './shared/constants';

export const transferWorkerProviders = [
  {
    provide: 'TRANSFER_WORKER',
    inject: [Activities],
    useFactory: async (activitiesService: Activities) => {
      const activities = {
        transferMoney: activitiesService.transferMoney.bind(activitiesService),
      };

      const connection = await NativeConnection.connect({
        address: 'temporal:7233',
        // TLS and gRPC metadata configuration goes here.
      });

      const worker = await Worker.create({
        connection,
        taskQueue,
        activities,
        workflowsPath: require.resolve('./temporal/workflows'),
      });

      await worker.run();
      console.log('Started worker!');

      return worker;
    },
  },
];
