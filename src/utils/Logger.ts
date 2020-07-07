'use strict';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Logger: any = {};

Logger.debuggable = false;
Logger.info = console.info;
Logger.warn = console.warn;
Logger.error = console.error;

Object.defineProperty(Logger, 'debug', {
    get() {
        return Logger.debuggable ? console.debug : (): void => {};
    },
    set() {},
    configurable: false,
});

export default Logger;
