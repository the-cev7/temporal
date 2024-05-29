import { Controller, Get } from '@nestjs/common';
import {
    WorkflowClient,
    WorkflowExecutionAlreadyStartedError,
} from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { taskQueueA, taskQueueB } from './shared/constants';
import { ITransfer } from './shared/types';

@Controller('transfers')
export class AppController {
    constructor(
        @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
    ) {}

    @Get()
    async getTransfer(): Promise<string | undefined> {
        const paramsA: ITransfer = {
            amount: 30,
            fromUser: 'C',
            toUser: 'A',
            referenceID: '0001',
        };

        const paramsB: ITransfer = {
            amount: 40,
            fromUser: 'C',
            toUser: 'B',
            referenceID: '0002',
        };

        try {
            const handleA = await this.temporalClient.start(
                'transferWorkflowA',
                {
                    args: [paramsA],
                    taskQueue: taskQueueA,
                    workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
                },
            );
            console.log(`Started workflow ${handleA.workflowId}`);

            const handleB = await this.temporalClient.start(
                'transferWorkflowB',
                {
                    args: [paramsB],
                    taskQueue: taskQueueB,
                    workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
                },
            );
            console.log(`Started workflow ${handleB.workflowId}`);
        } catch (err) {
            if (err instanceof WorkflowExecutionAlreadyStartedError) {
                console.log('Reusing existing exchange rates workflow');
            } else {
                throw err;
            }
        }

        return 'OK';
    }
}
