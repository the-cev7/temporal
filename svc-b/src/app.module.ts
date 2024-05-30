import { Module } from '@nestjs/common';
import { Activities } from './temporal/activities';
import { AppService } from './app.service';
import { transferWorkerProviders } from './app.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [Activities, ...transferWorkerProviders, AppService],
})
export class AppModule {}
