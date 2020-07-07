"use strict";


class Rect{
    
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
}

export default Rect;
