import { Module } from '@nestjs/common';
import { TemporalModule } from 'nestjs-temporal';
import { Runtime } from '@temporalio/worker';
import { Connection } from '@temporalio/client';
import { AppController } from './app.controller';

@Module({
  imports: [
    // client modules
    TemporalModule.registerClientAsync({
      useFactory: async () => {
        Runtime.install({});
        const temporalHost = 'temporal:7233';
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
