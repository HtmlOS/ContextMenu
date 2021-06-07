/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
'use strict';

import Rect from '../../utils/Rect';

class CHTMLElement {
    element: HTMLElement;

    constructor(element: any) {
        this.element = element;
    }

    public getBoundingClientRect(): Rect | undefined {
        if (this.element) {
            const dom = this.element.getBoundingClientRect();
            const top = dom.top - document.documentElement.clientTop;
            const left = dom.left - document.documentElement.clientLeft;
            return new Rect(left, top, dom.right - left, dom.bottom - top);
        }
        return undefined;
    }
}

export default CHTMLElement;
