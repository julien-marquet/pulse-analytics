import { Worker, Job } from 'bullmq';

export interface WorkerProcessor<T = any> {
  process(job: Job<T>): Promise<void>;
  onCompleted?(job: Job<T>): void;
  onFailed?(job: Job<T> | undefined, error: Error): void;
  onError?(error: Error): void;
}

export function createBullMQWorker<T>(
  queueName: string,
  redisUrl: string,
  processor: WorkerProcessor<T>,
): Worker<T> {
  const worker = new Worker<T>(queueName, (job) => processor.process(job), {
    connection: { url: redisUrl },
  });

  if (processor.onCompleted) {
    worker.on('completed', (job) => processor.onCompleted!(job));
  }
  if (processor.onFailed) {
    worker.on('failed', (job, err) => processor.onFailed!(job, err));
  }
  if (processor.onError) {
    worker.on('error', (err) => processor.onError!(err));
  }

  return worker;
}
