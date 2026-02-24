# Simple Task Queue (Node.js)

## Overview

This project implements a simple asynchronous task queue in Node.js.

The queue:

- Processes tasks in FIFO order (by default)
- Limits concurrent execution (`maxConcurrent`)
- Provides completion callbacks
- Handles failures gracefully
- Supports optional features: priority, pause/resume, retry

The implementation is written in plain Node.js (CommonJS) and follows the interface requirements described in the assignment.

---

## Architecture

The system is built around a single class:

### TaskQueue

Internal state:

- `_pending` – queue of waiting tasks  
- `_running` – number of currently running tasks  
- `_completed` – completed tasks counter  
- `_failed` – failed tasks counter  
- `_started`, `_paused`, `_stopped` – control flags  
- `_onCompleteCallbacks` – registered completion listeners  
- `_seq` – ensures stable FIFO ordering when priorities are equal  

### Core Internal Methods

#### `_tryDispatch()`

Responsible for dispatching tasks while:

- The queue is started  
- Not paused  
- Not stopped  
- `running < maxConcurrent`  
- There are pending tasks  

This method ensures controlled concurrency.

#### `_runTask(item)`

Wraps task execution:

- Measures execution time  
- Handles success/failure  
- Applies retry logic (if enabled)  
- Updates counters  
- Triggers callbacks  
- Frees a running slot  
- Calls `_tryDispatch()` again  

This guarantees that task failures do not break the queue.

---

## Task Interface (Conceptual)

Each task must provide:

```js
{
  id: string,
  name: string,
  execute: () => Promise<any>,
  priority?: number
}
```

---

## Status Object

`getStatus()` returns:

```js
{
  pending: number,
  running: number,
  completed: number,
  failed: number
}
```

---

## Concurrency Model

This implementation uses Node.js asynchronous execution.

Important:

- It is concurrent, not parallel.
- JavaScript runs on a single thread.
- Asynchronous tasks run via the event loop.
- `maxConcurrent` controls how many Promises are allowed to execute simultaneously.

---

## Stop vs Pause

Both prevent new tasks from starting.

- `pause()` – temporarily stops dispatching. Can be resumed using `resume()`.
- `stop()` – stops dispatching new tasks. Requires calling `start()` again to continue.

Neither interrupts already running tasks.

---

## Retry Logic (Bonus)

If `maxRetries` is configured:

- Failed tasks are retried up to the specified limit.
- Retries re-enter the pending queue.
- Only final failure updates the failed counter and triggers completion callback.

---

## Priority Queue (Bonus)

If `enablePriority` is enabled:

- Tasks with higher `priority` values run first.
- Tasks with equal priority maintain FIFO order.

---

## How to Run

### Install dependencies (if needed)

```bash
npm install
```

### Run example

```bash
node index.js
```

### Run tests

```bash
npm test
```

---

## Assumptions

- Task `id` is expected to be unique.
- Tasks return Promises.
- Tasks are not cancellable once started.
- The queue is in-memory only (no persistence).

---

## Design Decisions

- Clear separation between dispatch logic and execution wrapper.
- No external libraries required.
- Defensive validation for constructor and callbacks.
- Failure isolation: one task failure never breaks the queue.
- State-driven control using internal flags (`started`, `paused`, `stopped`).

---

## Summary

This implementation fulfills all required features:

✔ FIFO processing  
✔ Configurable concurrency  
✔ Completion callbacks  
✔ Graceful failure handling  

And includes bonus features:

✔ Priority support  
✔ Pause / Resume  
✔ Retry logic  

The architecture ensures predictable state transitions and controlled asynchronous execution.