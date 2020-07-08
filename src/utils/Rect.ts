'use strict';

class Rect {
    readonly l: number;
    readonly t: number;
    readonly r: number;
    readonly b: number;
    readonly w: number;
    readonly h: number;

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
}

export default Rect;
