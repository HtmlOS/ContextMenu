'use strict';

import './theme/default/index.css';

import {ContextMenu, ContextMenuOptions} from './model/ContextMenu';
import ContextMenuItem from './model/ContextMenuItem';

class ContextMenuManager {
    private static readonly contextmenu: ContextMenu = new ContextMenu();

    public static config(globalOptions?: ContextMenuOptions): void {
        this.contextmenu.config(globalOptions);
    }

    public static debug(b: boolean): void {
        this.contextmenu.debug(b);
    }

    public static hide(): void {
        this.contextmenu.hide();
    }

    public static show(menu: Array<ContextMenuItem>, options?: ContextMenuOptions): void {
        this.contextmenu.show(menu, options);
    }
}

if (window) {
    Object.defineProperty(window, 'ContextMenu', {
        value: ContextMenuManager,
        writable: false,
        configurable: false,
    });
}

export {ContextMenuManager as ContextMenu, ContextMenuOptions};
