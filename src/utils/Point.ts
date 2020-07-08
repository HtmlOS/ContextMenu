'use strict';

class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(point?: Point): boolean {
        return point != undefined && point !== null && this.x === point.x && this.y === point.y;
    }
}

export default Point;
