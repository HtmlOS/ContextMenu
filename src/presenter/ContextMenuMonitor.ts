'use strict';

import {ContextMenu} from '../model/ContextMenu';
import Rect from '../utils/Rect';
import Logger from '../utils/Logger';
import Utils from '../utils/Utils';
import HashMap from '../model/HashMap';
import {ContextMenuViewGlobal} from '../view/ContextMenuView';

/**
 * window 事件监听
 * 示例: start(["keydown:27", "keydown:ctrl+27", "mousedown", "resize",...])
 */
class EventListener {
    static readonly listeners: HashMap<string, EventListenerOrEventListenerObject> = new HashMap();
    static onevent: () => void;

    static stop(): void {
        this.listeners.forEach((value, key) => {
            window.removeEventListener(key, value);
        });
        this.listeners.clear();
    }

    static start(events: Array<string>): void {
        for (const event of events) {
            if (event === undefined || event === null || event.trim().length === 0) {
                Logger.debug('event not found');
                continue;
            }
            const splits: Array<string> = event.split(':');
            const type: string = splits[0];
            splits.shift();
            const codes: Array<string> = splits.length === 0 ? [] : splits;

            const listener = (e: Event): void => {
                if (e instanceof MouseEvent) {
                    //  step1. 先判断鼠标是否还在菜单区域内
                    const point = Utils.getMouseEventPoint(e);
                    const menuStacks = ContextMenuViewGlobal.getMenuStacks().values() || [];
                    for (const view of menuStacks) {
                        const rect: DOMRect = view.rootView.getBoundingClientRect();
                        if (
                            point.x >= rect.left &&
                            point.x <= rect.right &&
                            point.y >= rect.top &&
                            point.y <= rect.bottom
                        ) {
                            // 鼠标还在根菜单区域内
                            return;
                        }
                    }

                    //  step1. 再判断是否有指定哪个按键
                    const code = e.button;
                    const keys: Array<string> = [
                        code !== undefined ? '' + code : '',
                        e.altKey ? 'alt' : '',
                        e.ctrlKey ? 'alt' : '',
                        e.metaKey ? 'alt' : '',
                        e.shiftKey ? 'alt' : '',
                    ];
                    if (codes.length > 0 && !this.containsKey(codes, keys.join('+'))) {
                        return;
                    }

                    this.onevent();
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
                    if (code === 16 || code === 17 || code === 18 || code === 224) {
                        code = undefined;
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
                } else if (codes.length === 0) {
                    this.onevent();
                } else {
                    Logger.error('monitor unsupported event: ', event);
                }
            };

            Logger.debug('monitor add listener: ', event, type, codes);
            window.addEventListener(type, listener, true);
            this.listeners.set(event, listener);
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

    public static stop(): void {
        this.stopped = true;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }

    public static start(): void {
        this.stop();

        this.stopped = false;
        this.run();
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
}
/**
 * auto hide monitor
 */
class ContextMenuMonitor {
    public static start(): void {
        Logger.debug('monitor start');

        const callback = (): void => {
            if (ContextMenu.presenter) {
                ContextMenu.hide();
                Logger.debug('monitor hidemenu');
            }
        };

        TargetRectListner.onchanged = callback;
        TargetRectListner.start();

        EventListener.onevent = callback;
        EventListener.start([
            'keydown:27', // 按键:ESC
            'mousedown', // 鼠标按下
            'resize', // 窗口大小变化
            // 'scroll', // 滚动
        ]);
    }

    public static stop(): void {
        TargetRectListner.stop();
        EventListener.stop();
        Logger.debug('monitor stop');
    }
}

export default ContextMenuMonitor;
