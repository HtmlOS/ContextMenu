'use strict';

import Point from './Point';
import Rect from './Rect';

class Utils {
    public static preventEvent(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
    }

    public static getCurrentScrollTop(): number {
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    public static getCurrentScrollLeft(): number {
        let scrollLeft = 0;
        if (document.documentElement && document.documentElement.scrollLeft) {
            scrollLeft = document.documentElement.scrollLeft;
        } else if (document.body) {
            scrollLeft = document.body.scrollLeft;
        }
        return scrollLeft;
    }

    public static getMouseEventPoint(e: MouseEvent): Point {
        const scrollX = Utils.getCurrentScrollLeft();
        const scrollY = Utils.getCurrentScrollTop();

        const x = e.clientX || e.pageX - scrollX;
        const y = e.clientY || e.pageY - scrollY;

        return new Point(x, y);
    }

    public static getClientRect(padding?: number): Rect {
        padding = padding || 0;
        let winWidth = 0;
        let winHeight = 0;
        // 获取窗口宽度
        if (window.innerWidth) {
            winWidth = window.innerWidth;
        } else if (document.body && document.body.clientWidth) {
            winWidth = document.body.clientWidth;
        }
        // 获取窗口高度
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if (document.body && document.body.clientHeight) {
            winHeight = document.body.clientHeight;
        }
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
        }

        return new Rect(padding, padding, winWidth - padding * 2, winHeight - padding * 2);
    }

    public static getBoundingClientRect(element: Element): Rect {
        const dom = element.getBoundingClientRect();
        const top = dom.top - document.documentElement.clientTop;
        const left = dom.left - document.documentElement.clientLeft;
        return new Rect(left, top, dom.right - left, dom.bottom - top);
    }
    public static visitElemementChildren(
        element: HTMLElement,
        callback: (index: number, child: HTMLElement) => void
    ): void {
        let child = element.firstChild;
        let index = 0;
        while (child !== undefined && child !== null) {
            if (child.nodeType === 1 && child instanceof HTMLElement) {
                callback(index++, child);
            }
            child = child.nextSibling;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public static assignObject(target: any, ...srcs: any[]): void {
        if (target === undefined || target === null) {
            return;
        }

        for (const source of srcs) {
            if (source === undefined || source === null) {
                continue;
            }
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
}

export default Utils;
