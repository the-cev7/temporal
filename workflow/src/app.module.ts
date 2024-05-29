import { Module } from '@nestjs/common';
import { TemporalModule } from 'nestjs-temporal';
import { NativeConnection, Runtime } from '@temporalio/worker';
import { Connection } from '@temporalio/client';
import { AppController } from './app.controller';
import { taskQueueA, taskQueueB } from './shared/constants';

@Module({
    imports: [
        // worker modules
        TemporalModule.registerWorkerAsync({
            useFactory: async () => {
                Runtime.install({});
                const temporalHost = 'localhost:7233';
                const connection = await NativeConnection.connect({
                    address: temporalHost,
                });

                return {
                    workerOptions: {
                        connection,
                        taskQueue: taskQueueA,
                        workflowsPath: require.resolve('./temporal/workflows'),
                    },
                };
            },
        }),
        TemporalModule.registerWorkerAsync({
            useFactory: async () => {
                const temporalHost = 'localhost:7233';
                const connection = await NativeConnection.connect({
                    address: temporalHost,
                });

                return {
                    workerOptions: {
                        connection,
                        taskQueue: taskQueueB,
                        workflowsPath: require.resolve('./temporal/workflows'),
                    },
                };
            },
        }),
        // client modules
        TemporalModule.registerClientAsync({
            useFactory: async () => {
                const temporalHost = 'localhost:7233';
                const connection = await Connection.connect({
                    address: temporalHost,
                });

                return {
                    connection,
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
