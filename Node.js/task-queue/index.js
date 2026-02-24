'use strict';

const TaskQueue = require('./task-queue');

const queue = new TaskQueue({ maxConcurrent: 2, enablePriority: true, maxRetries: 1 });

queue.onTaskComplete((r) => {
  console.log(`Task ${r.id} ${r.status} in ${r.duration}ms`);
});

queue.add({
  id: '1',
  name: 'Fetch Data',
  priority: 1,
  execute: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: 'fetched' };
  }
});

queue.add({
  id: '2',
  name: 'Process Data',
  priority: 2,
  execute: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { processed: true };
  }
});

queue.start();

setTimeout(() => {
  console.log('STATUS:', queue.getStatus());
}, 2000);