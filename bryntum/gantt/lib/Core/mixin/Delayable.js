import Base from '../Base.js';
import VersionHelper from '../helper/VersionHelper.js';

/**
 * @module Core/mixin/Delayable
 */

// Global timeout collections for tests
let globalDelays = null;

if (VersionHelper.isTestEnv) {
    globalDelays = window.bryntum.globalDelays = {
        timeouts        : new Map(),
        intervals       : new Map(),
        animationFrames : new Map(),
        isEmpty(includeIntervals = false) {
            return globalDelays.timeouts.size + globalDelays.animationFrames.size + (includeIntervals ? globalDelays.intervals.size : 0) === 0;
        }
    };
}

/**
 * Tracks setTimeout, setInterval and requestAnimationFrame calls and clears them on destroy.
 *
 * @example
 * someClass.setTimeout(() => console.log('hi'), 200);
 * someClass.setInterval(() => console.log('annoy'), 100);
 * // can also use named timeouts for easier tracking
 * someClass.setTimeout(() => console.log('named'), 300, 'named');
 * someClass.clearTimeout('named');
 *
 * @mixin
 */
export default Target => class Delayable extends (Target || Base) {
    get isDelayable() {
        return true;
    }

    doDestroy() {
        const me = this;

        if (me.timeoutIds) {
            me.timeoutIds.forEach((fn, id) => {
                if (typeof fn === 'function') {
                    fn();
                }

                clearTimeout(id);

                if (globalDelays) {
                    globalDelays.timeouts.delete(id);
                }
            });
            me.timeoutIds = null;
        }

        if (me.timeoutMap) {
            me.timeoutMap.forEach((name, id) => clearTimeout(id));
            me.timeoutMap = null;
        }

        if (me.intervalIds) {
            me.intervalIds.forEach(id => {
                clearInterval(id);

                if (globalDelays) {
                    globalDelays.intervals.delete(id);
                }
            });
            me.intervalIds = null;
        }

        if (me.animationFrameIds) {
            me.animationFrameIds.forEach(id => {
                cancelAnimationFrame(id);

                if (globalDelays) {
                    globalDelays.animationFrames.delete(id);
                }
            });
            me.animationFrameIds = null;
        }

        super.doDestroy();
    }

    /**
     * Check if a named timeout is active
     * @param name
     * @internal
     */
    hasTimeout(name) {
        return !!(this.timeoutMap && this.timeoutMap.has(name));
    }

    /**
     * Same as native setTimeout, but will be cleared automatically on destroy. If a propertyName is supplied it will
     * be used to store the timeout id.
     * @param {Object} timeoutSpec An object containing the details about that function, and the time delay.
     * @param {Function|String} timeoutSpec.fn The function to call, or name of function in this object to call. Used as the `name` parameter if a string.
     * @param {Number} timeoutSpec.delay The milliseconds to delay the call by.
     * @param {Object[]} timeoutSpec.args The arguments to pass.
     * @param {String} [timeoutSpec.name] The name under which to register the timer. Defaults to `fn.name`.
     * @param {Boolean} [timeoutSpec.runOnDestroy] Pass `true` if this function should be executed if the Delayable instance is destroyed while function is scheduled.
     * @param {Boolean} [timeoutSpec.cancelOutstanding] Pass `true` to cancel any outstanding invocation of the passed function.
     * @returns {Number}
     * @internal
     */
    setTimeout({ fn, delay, name, runOnDestroy, cancelOutstanding, args }) {
        if (arguments.length > 1 || typeof arguments[0] === 'function') {
            [fn, delay, name, runOnDestroy] = arguments;
        }
        if (typeof fn === 'string') {
            name = fn;
        }
        else if (!name) {
            name = fn.name;
        }

        if (cancelOutstanding) {
            this.clearTimeout(name);
        }

        const
            me         = this,
            timeoutIds = me.timeoutIds || (me.timeoutIds = new Map()),
            timeoutMap = me.timeoutMap || (me.timeoutMap = new Map()),
            timeoutId  = setTimeout(() => {
                if (typeof fn === 'string') {
                    fn = me[name];
                }

                // Cleanup before invocation in case fn throws
                timeoutIds && timeoutIds.delete(timeoutId);
                timeoutMap && timeoutMap.delete(name);
                globalDelays && globalDelays.timeouts.delete(timeoutId);

                fn.apply(me, args);

            }, delay);

        timeoutIds.set(timeoutId, runOnDestroy ? fn : true);

        if (globalDelays) {
            globalDelays.timeouts.set(timeoutId, { fn, delay, name });
        }

        if (name) {
            timeoutMap.set(name, timeoutId);
        }

        return timeoutId;
    }

    /**
     * clearTimeout wrapper, either call with timeout id as normal clearTimeout or with timeout name (if you specified
     * a name to setTimeout())
     * property to null.
     * @param {Number|String} idOrName timeout id or name
     * @internal
     */
    clearTimeout(idOrName) {
        let id = idOrName;

        if (typeof id === 'string') {
            if (this.timeoutMap) {
                id = this.timeoutMap.get(idOrName);
                this.timeoutMap.delete(idOrName);
            }
            else {
                return;
            }
        }

        clearTimeout(id);

        this.timeoutIds && this.timeoutIds.delete(id);
        globalDelays && globalDelays.timeouts.delete(id);
    }

    /**
     * clearInterval wrapper
     * @param {Number} id
     * @internal
     */
    clearInterval(id) {
        clearInterval(id);

        this.intervalIds && this.intervalIds.delete(id);

        globalDelays && globalDelays.intervals.delete(id);
    }

    /**
     * Same as native setInterval, but will be cleared automatically on destroy
     * @param fn
     * @param delay
     * @returns {Number}
     * @internal
     */
    setInterval(fn, delay) {
        const intervalId = setInterval(fn, delay);

        (this.intervalIds || (this.intervalIds = new Set())).add(intervalId);

        globalDelays && globalDelays.intervals.set(intervalId, { fn, delay });

        return intervalId;
    }

    /**
     * Relays to native requestAnimationFrame and adds to tracking to have call automatically canceled on destroy.
     * @param {Function} fn
     * @param {Object[]} [extraArgs] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @returns {Number}
     * @internal
     */
    requestAnimationFrame(fn, extraArgs = [], thisObj = this) {
        const
            animationFrameIds = this.animationFrameIds || (this.animationFrameIds = new Set()),
            frameId           = requestAnimationFrame(() => {
                globalDelays && globalDelays.animationFrames.delete(frameId);
                animationFrameIds.delete(frameId);
                return fn.apply(thisObj, extraArgs);
            });

        animationFrameIds.add(frameId);

        globalDelays && globalDelays.animationFrames.set(frameId, { fn, extraArgs, thisObj });

        return frameId;
    }

    /**
     * Creates a function which will execute once, on the next animation frame. However many time it is
     * called in one event run, it will only be scheduled to run once.
     * @param {Function|String} fn The function to call, or name of function in this object to call.
     * @param {Object[]} [args] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Boolean} [cancelOutstanding] Cancel any outstanding queued invocation upon call.
     * @internal
     */
    createOnFrame(fn, extraArgs = [], thisObj = this, cancelOutstanding) {
        let rafId;

        const result = (...args) => {
            // Cancel if outstanding if requested
            if (rafId && cancelOutstanding) {
                this.cancelAnimationFrame(rafId);
                rafId = null;
            }
            if (!rafId) {
                rafId = this.requestAnimationFrame(() => {
                    if (typeof fn === 'string') {
                        fn = thisObj[fn];
                    }
                    rafId = null;
                    args.push(...extraArgs);
                    fn.apply(thisObj, args);
                });
            }
        };

        result.cancel = () => this.cancelAnimationFrame(rafId);

        return result;
    }

    /**
     * Relays to native cancelAnimationFrame and removes from tracking.
     * @param {Number} handle
     * @internal
     */
    cancelAnimationFrame(handle) {
        cancelAnimationFrame(handle);

        this.animationFrameIds && this.animationFrameIds.delete(handle);

        globalDelays && globalDelays.animationFrames.delete(handle);
    }

    /**
     * Wraps a function with another function that delays it specified amount of time, repeated calls to the wrapper
     * resets delay.
     * @param {Function|String} fn Function to buffer, or name of function in this object to call.
     * @param {Number} delay Delay in ms
     * @param {Object} [thisObj] `this` reference for the function.
     * @returns {Function} Wrapped function, call this
     * @internal
     */
    buffer(fn, delay, thisObj = this) {
        let timeoutId = null;

        if (typeof fn === 'string') {
            fn = thisObj[fn];
        }

        const func = (...params) => {
            func.called = false;

            if (timeoutId !== null) {
                this.clearTimeout(timeoutId);
            }

            timeoutId = this.setTimeout(() => {
                fn.call(thisObj, ...params); // this will be instance of class that we are mixed into.
                func.called = true;
            }, delay);
        };

        func.cancel = () => this.clearTimeout(timeoutId);

        return func;
    }

    /**
     * Create a "debounced" function which will call on the "leading edge" of a timer period.
     * When first invoked will call immediately, but invocations after that inside its buffer
     * period will be rejected, and *one* invocation will be made after the buffer period has expired.
     *
     * This is useful for responding immediately to a first mousemove, but from then on, only
     * calling the action function on a regular timer while the mouse continues to move.
     *
     * @param {Function} fn The function to call.
     * @param {Number} buffer The milliseconds to wait after each execution before another execution takes place.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Array} [extraArgs] The argument list to append to those passed to the function.
     * @param {Function} [alt] A function to call when the invocation is rejected due to buffer time not having expired.
     * @internal
     */
    throttle(fn, buffer, thisObj = this, extraArgs, alt) {
        const me = this;

        let lastCallTime = 0,
            callArgs,
            timerId;

        const invoke = () => {
            timerId = 0;
            lastCallTime = performance.now();
            callArgs.push.apply(callArgs, extraArgs);
            fn.apply(thisObj, callArgs);
            result.called = true;
        };

        const result = (...args) => {
            const elapsed = performance.now() - lastCallTime;

            callArgs = args;

            // If it's been more then the buffer period since we invoked, we can call it now
            if (elapsed >= buffer) {
                me.clearTimeout(timerId);
                invoke();
            }
            // Otherwise, kick off a timer for the requested period.
            else {
                if (!timerId) {
                    timerId = me.setTimeout(invoke, buffer - elapsed);
                    result.called = false;
                }
                if (alt) {
                    callArgs.push.apply(callArgs, extraArgs);
                    alt.apply(thisObj, callArgs);
                }
            }
        };

        result.cancel = () => me.clearTimeout(timerId);

        return result;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
