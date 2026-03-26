import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('event')
export class EventProcessor extends WorkerHost {
  // eslint-disable-next-line @typescript-eslint/require-await
  async process(job: Job<any>): Promise<any> {
    console.log('handled');
    return 'ok';
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.info('completed');
  }

  @OnWorkerEvent('error')
  onError() {
    console.error('error');
  }
}
