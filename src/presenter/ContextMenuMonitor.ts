'use strict';

import {ContextMenu} from '../model/ContextMenu';
import Rect from '../utils/Rect';
import Logger from '../utils/Logger';

/**
 * window 事件监听
 * 示例: start(["keydown:27", "keydown:ctrl+27", "mousedown", "resize",...])
 */
class EventListener {
    static listeners: Map<string, EventListenerOrEventListenerObject>;
    static onevent: () => void;

    static start(events: Array<string>): void {
        for (const event of events) {
            if (event === undefined || event === null || event.trim().length === 0) {
                continue;
            }
            const splits: Array<string> = event.split(':');
            const type: string = splits[0];
            splits.shift();
            const codes: Array<string> = splits.length === 0 ? [] : splits;

            Logger.debug('monitor add listener: ', event, type, codes);

            window.addEventListener(
                type,
                (e): void => {
                    if (codes.length === 0) {
                        this.onevent();
                    } else if (e instanceof MouseEvent) {
                        const code = e.button;
                        const keys: Array<string> = [
                            code !== undefined ? '' + code : '',
                            e.altKey ? 'alt' : '',
                            e.ctrlKey ? 'alt' : '',
                            e.metaKey ? 'alt' : '',
                            e.shiftKey ? 'alt' : '',
                        ];
                        if (this.containsKey(codes, keys.join('+'))) {
                            this.onevent();
                        }
                    } else if (e instanceof KeyboardEvent) {
                        let code: number | undefined = undefined;
                        if (e.keyCode !== undefined) {
                            code = code === undefined ? e.keyCode : Math.max(code, e.keyCode);
                        }
                        if (e.charCode !== undefined) {
                            code = code === undefined ? e.charCode : Math.max(code, e.charCode);
                        }
                        if (e.which !== undefined) {
                            code = code === undefined ? e.which : Math.max(code, e.which);
                        }
                        const keys: Array<string> = [
                            code !== undefined ? '' + code : '',
                            e.altKey ? 'alt' : '',
                            e.ctrlKey ? 'ctrl' : '',
                            e.metaKey ? 'meta' : '',
                            e.shiftKey ? 'shift' : '',
                        ];
                        if (this.containsKey(codes, keys.join('+'))) {
                            this.onevent();
                        }
                    } else {
                        Logger.error('monitor unsupported event: ', event);
                    }
                },
                true
            );
        }
    }

    private static equalsKey(code: string, key: string): boolean {
        const fix = function (str: string): string {
            str = str.replace(/\s+/g, ''); // 去除所有空格
            str = str.replace(/\++/g, '+'); // 合并所有+号
            str = str.replace(/^\++/g, ''); // 去除开头+号
            str = str.replace(/\++$/g, ''); //去除结尾+号
            return str;
        };
        code = fix(code);
        key = fix(key);

        const codes = code.split('+');
        const keys = key.split('+');

        codes.sort();
        keys.sort();

        code = codes.join('+');
        key = keys.join('+');

        Logger.debug('monitor event equals : ', code, key);
        return code === key;
    }
    private static containsKey(codes: Array<string>, key: string): boolean {
        for (const item of codes) {
            if (this.equalsKey(item, key)) {
                return true;
            }
        }
        return false;
    }

    static stop(): void {
        this.listeners.forEach((value, key) => {
            window.removeEventListener(key, value);
        });
    }
}

/**
 * 监听 presenter
 * 定时查询 target 的 rect 是否变化
 */
class TargetRectListner {
    static timer?: NodeJS.Timeout;
    static stopped: boolean;

    static targetRect?: Rect;

    static onchanged: () => void;

    public static start(): void {
        this.stop();
        this.run();
        this.stopped = false;
    }

    private static run(): void {
        if (this.stopped === true) {
            return;
        }
        this.timer = setTimeout(() => {
            const target = ContextMenu.presenter?.event.target;
            if (target instanceof HTMLElement) {
                const clientRect = target.getBoundingClientRect();
                const domRect = new Rect(clientRect.left, clientRect.top, clientRect.right, clientRect.bottom);
                if (this.targetRect !== undefined && !domRect.equals(this.targetRect)) {
                    this.hide();
                } else {
                    this.targetRect = domRect;
                }
            }
            this.run();
        }, 100);
    }

    private static hide(): void {
        this.targetRect = undefined;
        if (this.onchanged) {
            this.onchanged();
        }
    }
    public static stop(): void {
        this.stopped = true;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
}
/**
 * auto hide monitor
 */
class ContextMenuMonitor {
    public static start(): void {
        Logger.debug('monitor start');

        const callback = (): void => {
            ContextMenu.hide();
            Logger.debug('monitor hidemenu');
        };

        TargetRectListner.onchanged = callback;
        TargetRectListner.start();

        EventListener.onevent = callback;
        EventListener.start(['keydown:27', 'mousedown', 'resize', 'scroll']);
    }

    public static stop(): void {
        TargetRectListner.stop();
        EventListener.stop();
        Logger.debug('monitor stop');
    }
}

export default ContextMenuMonitor;
