'use strict';

class Formatter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static format(fmt: string, ...args: any[]): string {
        let result = fmt;
        for (const index in args) {
            const arg = args[index] || '';
            const reg = new RegExp('({)' + index + '(})', 'g');
            result = result.replace(reg, arg);
        }
        return result;
    }
}
export {Formatter};
