/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
'use strict';

import Point from './Point';
import Rect from './Rect';
import CHTMLElement from '../model/compatible/CHTMLElement';

class Utils {
    public static preventEvent(e: Event): void {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
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

    public static visitElemementChildren(
        element: HTMLElement,
        callback: (index: number, child: CHTMLElement) => void
    ): void {
        let child = element.firstChild;
        let index = 0;
        while (child !== undefined && child !== null) {
            if (child.nodeType === 1) {
                callback(index++, new CHTMLElement(child));
            }
            child = child.nextSibling;
        }
    }
}

export default Utils;
