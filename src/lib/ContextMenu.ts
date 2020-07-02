'use strict';

import Menu from './Menu';
import MenuOptions from './MenuOptions';

class ContextMenu {
    install(): void {}

    static hide(): void {
        const e = window.event;
        if (!e) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
    }
    static show(menu: Menu, options?: MenuOptions): void {
        const e = window.event;
        if (!e) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        ContextMenu.hide();
    }
}
Object.defineProperty(window, 'ContextMenu', {
    value: ContextMenu,
    writable: false,
    configurable: false,
});
export default ContextMenu;
