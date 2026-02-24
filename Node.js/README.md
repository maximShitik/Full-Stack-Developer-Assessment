# Node.js — TaskQueue (Async Concurrency + Priority + Retries)

## Overview
This section implements a lightweight `TaskQueue` that runs async tasks with:
- configurable concurrency
- optional priority scheduling
- optional retry support
- completion callbacks + runtime status reporting

The focus is clean async control flow, predictable behavior, and safe task execution.

---

## Architecture

### Core Class: `TaskQueue`
Holds all queue state and orchestration logic:
- **Pending queue** (`_pending`) stores tasks waiting to run
- **Running counter** (`_running`) enforces `maxConcurrent`
- **Stats counters** (`_completed`, `_failed`) track outcomes
- Control flags:
  - `_started`, `_stopped`, `_paused`

### Scheduling / Dispatch
- `_tryDispatch()` is the central dispatcher:
  - runs while there is capacity (`_running < maxConcurrent`)
  - pulls from `_pending` and starts tasks
- Priority mode (optional):
  - tasks are sorted by `priority` (higher first)
  - FIFO order preserved among same priority via `seq`

### Execution + Error Handling
- `_runTask(item)` executes `task.execute()` with `await`
- Captures failures and converts them into a stable error message
- If `maxRetries > 0`, failed tasks are re-queued until attempts are exhausted
- A `TaskResult` object is emitted to all `onTaskComplete()` callbacks:
  - `{ id, status, duration, result? , error? }`

Callbacks are isolated (errors inside callbacks do not crash the queue).

---

## Features
- Concurrency limiting (`maxConcurrent`)
- Start / Stop / Pause / Resume controls
- Optional priority scheduling (`enablePriority`)
- Optional retries (`maxRetries`)
- Status snapshot (`getStatus()`)
- Task completion callbacks (`onTaskComplete()`)

---

## Assumptions
- Each task provides an async `execute()` function returning a Promise
- Tasks are independent and safe to run concurrently
- Errors thrown by task functions are expected and treated as “failed” results
- If the queue is stopped, no new tasks are dispatched (running tasks may still finish)

---

## How to Run
```bash
cd typescript   # or nodejs folder (depending on your repo structure)
npm install
npm test
npm run dev