import { Module } from '@nestjs/common';
import { Activities } from './temporal/activities';
import { AppService } from './app.service';
import { paymentWorkerProviders } from './app.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [Activities, ...paymentWorkerProviders, AppService],
})
export class AppModule {}
