'use strict';

import Utils from './Utils';

class Rect {
    l: number;
    t: number;
    r: number;
    b: number;
    w: number;
    h: number;

    constructor(l: number, t: number, w: number, h: number) {
        this.l = l;
        this.t = t;
        this.r = l + w;
        this.b = t + h;
        this.w = w;
        this.h = h;
    }

    equals(rect?: Rect): boolean {
        return (
            rect != undefined &&
            rect !== null &&
            this.l === rect.l &&
            this.t === rect.t &&
            this.r === rect.r &&
            this.b === rect.b &&
            this.w === rect.w &&
            this.h === rect.h
        );
    }

    assign(from: Rect): void {
        Utils.assignObject(this, from);
    }
}

export default Rect;
