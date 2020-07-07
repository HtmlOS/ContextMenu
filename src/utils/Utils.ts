'use strict';

import Point from './Point';
import Rect from './Rect';

class Utils {
    static preventEvent(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
    }

    static getCurrentScrollTop(): number {
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    static getCurrentScrollLeft(): number {
        let scrollLeft = 0;
        if (document.documentElement && document.documentElement.scrollLeft) {
            scrollLeft = document.documentElement.scrollLeft;
        } else if (document.body) {
            scrollLeft = document.body.scrollLeft;
        }
        return scrollLeft;
    }

    static getCurrentEventLocation(e: MouseEvent): Point {
        const scrollX = this.getCurrentScrollLeft();
        const scrollY = this.getCurrentScrollTop();

        const x = e.pageX || e.clientX + scrollX;
        const y = e.pageY || e.clientY + scrollY;

        return new Point(x, y);
    }

    static getScreenRect(): Rect {
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

        return new Rect(0, 0, winWidth, winHeight);
    }
}

export default Utils;