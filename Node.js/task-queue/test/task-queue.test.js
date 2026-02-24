'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const TaskQueue = require('../task-queue.js');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Helper: wait until condition true or timeout
 */
async function waitUntil(fn, timeoutMs = 2000, stepMs = 10) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (fn()) return;
    await sleep(stepMs);
  }
  throw new Error('waitUntil timeout');
}

test('FIFO order when priority disabled', async () => {
  const queue = new TaskQueue({ maxConcurrent: 1, enablePriority: false });

  const completedOrder = [];
  queue.onTaskComplete((r) => completedOrder.push(r.id));

  queue.add({ id: '1', name: 't1', execute: async () => { await sleep(30); } });
  queue.add({ id: '2', name: 't2', execute: async () => { await sleep(10); } });
  queue.add({ id: '3', name: 't3', execute: async () => { await sleep(5); } });

  queue.start();

  await waitUntil(() => queue.getStatus().completed === 3);

  assert.deepEqual(completedOrder, ['1', '2', '3']);
  assert.deepEqual(queue.getStatus(), { pending: 0, running: 0, completed: 3, failed: 0 });
});

test('Respects maxConcurrent limit', async () => {
  const maxConcurrent = 2;
  const queue = new TaskQueue({ maxConcurrent });

  let runningNow = 0;
  let maxObserved = 0;

  const mkTask = (id) => ({
    id,
    name: `t${id}`,
    execute: async () => {
      runningNow += 1;
      maxObserved = Math.max(maxObserved, runningNow);
      await sleep(50);
      runningNow -= 1;
    },
  });

  queue.add(mkTask('1'));
  queue.add(mkTask('2'));
  queue.add(mkTask('3'));
  queue.add(mkTask('4'));

  queue.start();

  await waitUntil(() => queue.getStatus().completed === 4);

  assert.equal(maxObserved, 2); // never exceed 2
  assert.equal(queue.getStatus().failed, 0);
});

test('Failure is handled gracefully (queue continues)', async () => {
  const queue = new TaskQueue({ maxConcurrent: 1 });

  const results = [];
  queue.onTaskComplete((r) => results.push(r));

  queue.add({
    id: 'bad',
    name: 'bad',
    execute: async () => {
      await sleep(10);
      throw new Error('boom');
    },
  });

  queue.add({
    id: 'good',
    name: 'good',
    execute: async () => {
      await sleep(10);
      return 123;
    },
  });

  queue.start();

  await waitUntil(() => queue.getStatus().completed + queue.getStatus().failed === 2);

  assert.equal(queue.getStatus().failed, 1);
  assert.equal(queue.getStatus().completed, 1);

  const bad = results.find(r => r.id === 'bad');
  const good = results.find(r => r.id === 'good');

  assert.equal(bad.status, 'failed');
  assert.ok(bad.error.includes('boom'));

  assert.equal(good.status, 'completed');
  assert.equal(good.result, 123);
});

test('pause() prevents starting new tasks, resume() continues', async () => {
  const queue = new TaskQueue({ maxConcurrent: 2 });

  let started = 0;

  const mkTask = (id) => ({
    id,
    name: `t${id}`,
    execute: async () => {
      started += 1;
      await sleep(60);
    },
  });

  queue.add(mkTask('1'));
  queue.add(mkTask('2'));
  queue.add(mkTask('3'));

  queue.start();

  // give time for up to 2 tasks to start
  await sleep(10);
  queue.pause();

  // after pause, no new tasks should start (3rd should not start yet)
  await sleep(30);
  assert.equal(started, 2);

  queue.resume();
  await waitUntil(() => queue.getStatus().completed === 3);

  assert.equal(queue.getStatus().failed, 0);
});

test('stop() prevents starting new tasks (running tasks finish)', async () => {
  const queue = new TaskQueue({ maxConcurrent: 2 });

  let started = 0;

  const mkTask = (id) => ({
    id,
    name: `t${id}`,
    execute: async () => {
      started += 1;
      await sleep(80);
    },
  });

  queue.add(mkTask('1'));
  queue.add(mkTask('2'));
  queue.add(mkTask('3'));
  queue.add(mkTask('4'));

  queue.start();
  await sleep(10);

  queue.stop();

  // allow time for running tasks to finish
  await sleep(120);

  // with stop, only the tasks that already started should have run (2 tasks)
  assert.equal(started, 2);
  assert.deepEqual(queue.getStatus(), {
    pending: 2,      // 3 and 4 still waiting
    running: 0,
    completed: 2,
    failed: 0
  });
});