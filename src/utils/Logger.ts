/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

const Logger: any = {};

Logger.debuggable = false;

Logger.debug = function (message?: any, ...args: any[]): void {
    if (Logger.debuggable) {
        console.log.apply(console, [message, args]);
    }
};
Logger.error = function (message?: any, ...args: any[]): void {
    console.error.apply(console, [message, args]);
};
export default Logger;
