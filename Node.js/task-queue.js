"use strict";


class TaskQueue {

    constructor(options = {}) {
        if (
            typeof options.maxConcurrent !== "number" ||
            options.maxConcurrent <= 0
        ) {
            throw new Error("maxConcurrent must be a positive number");
        }

        this._maxConcurrent = options.maxConcurrent;
        this._enablePriority = Boolean(options.enablePriority);
        this._maxRetries =
            typeof options.maxRetries === "number" ? options.maxRetries : 0;

        this._pending = [];
        this._running = 0;
        this._completed = 0;
        this._failed = 0;

        this._started = false;
        this._stopped = false;
        this._paused = false;

        this._seq = 0; 
        this._onCompleteCallbacks = [];
    }


    add(task) {
        if (!task || typeof task.execute !== 'function') {
            throw new Error('Invalid task');
        }

        const item = {
            task,
            seq: this._seq++,
            attempts: 0,
        };

        this._pending.push(item);

        if (this._enablePriority) {
            this._pending.sort((a, b) => {
                const pa = a.task.priority || 0;
                const pb = b.task.priority || 0;

                if (pb !== pa) {
                    return pb - pa; // higher first
                }

                return a.seq - b.seq; // FIFO for same priority
            });
        }

        if (this._started && !this._paused && !this._stopped) {
            this._tryDispatch();
        }
    }
    start() {
        if (this._started) {
            this._stopped = false;
            this._paused = false;
            this._tryDispatch();
            return;
        }

        this._started = true;
        this._stopped = false;
        this._paused = false;

        this._tryDispatch();
    }

    stop() {
        this._stopped = true;
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;

        if (this._started && !this._stopped) {
            this._tryDispatch();
        }
    }

    getStatus() {
        return {
            pending: this._pending.length,
            running: this._running,
            completed: this._completed,
            failed: this._failed,
        };
    }

    onTaskComplete(callback) {
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        this._onCompleteCallbacks.push(callback);
    }




    // Internal helpers


    _tryDispatch() {
        if (!this._started) return;
        if (this._stopped) return;
        if (this._paused) return;

        while (this._running < this._maxConcurrent && this._pending.length > 0) {
            const item = this._pending.shift();
            this._running += 1;

            this._runTask(item);
        }
    }

    async _runTask(item) {
        const startTime = Date.now();

        let status = 'completed';
        let result;
        let errorMsg;

        try {
            result = await item.task.execute();
        } catch (err) {
            status = 'failed';
            errorMsg = (err && err.message) ? err.message : String(err);
        }

        const duration = Date.now() - startTime;

        if (status === 'failed' && item.attempts < this._maxRetries) {
            item.attempts += 1;

            this._pending.push(item);

            if (this._enablePriority) {
                this._pending.sort((a, b) => {
                    const pa = a.task.priority || 0;
                    const pb = b.task.priority || 0;
                    if (pb !== pa) return pb - pa;
                    return a.seq - b.seq;
                });
            }

            this._running -= 1;
            this._tryDispatch();
            return;
        }

        if (status === 'completed') {
            this._completed += 1;
        } else {
            this._failed += 1;
        }

        const taskResult = {
            id: item.task.id,
            status,
            duration,
        };

        if (status === 'completed') {
            taskResult.result = result;
        } else {
            taskResult.error = errorMsg;
        }

        for (const cb of this._onCompleteCallbacks) {
            try {
                cb(taskResult);
            } catch (e) {
            }
        }

        this._running -= 1;
        this._tryDispatch();
    }
}

module.exports = TaskQueue;
