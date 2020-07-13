/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
'use strict';

import Point from '../../utils/Point';
import Utils from '../../utils/Utils';
import CHTMLElement from './CHTMLElement';

class CEvent {
    readonly e: any;
    readonly target: CHTMLElement;

    // mosue& keyboard events
    readonly ctrlKey: boolean;
    readonly altKey: boolean;
    readonly shiftKey: boolean;
    readonly metaKey: boolean;

    // mosue events
    readonly button: number;

    // keyboard events
    readonly keyCode: number;
    readonly charCode: number;
    readonly which: number;

    constructor(e: any) {
        this.e = e;
        this.target = new CHTMLElement(e?.target);

        this.button = e.button;

        this.keyCode = e.keyCode;
        this.charCode = e.charCode;
        this.which = e.which;

        this.ctrlKey = e.ctrlKey;
        this.altKey = e.altKey;
        this.shiftKey = e.shiftKey;
        this.metaKey = e.metaKey;
    }

    public isKeyboardEvent(): boolean {
        return this.e instanceof KeyboardEvent || this.e.keyCode || this.e.charCode || this.e.which;
    }

    public isMouseEvent(): boolean {
        return this.e instanceof MouseEvent || this.e.button;
    }

    public getPoint(): Point {
        const scrollX = Utils.getCurrentScrollLeft();
        const scrollY = Utils.getCurrentScrollTop();

        const x = this.e.clientX || this.e.pageX - scrollX;
        const y = this.e.clientY || this.e.pageY - scrollY;

        return new Point(x, y);
    }

    public prevent(): void {
        if (this.e.preventDefault) {
            this.e.preventDefault();
        }
        if (this.e.stopPropagation) {
            this.e.stopPropagation();
        }
        this.e.cancelBubble = true;
        this.e.returnValue = false;
    }
}

export default CEvent;
