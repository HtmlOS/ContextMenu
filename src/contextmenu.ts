'use strict';

import './theme/default/index.css';

import ContextMenu from './model/ContextMenu';
import ContextMenuOptions from './model/ContextMenuOptions';
import Logger from './utils/Logger';

const globalContextMenu = new ContextMenu();
if (window) {
    Object.defineProperty(window, 'ContextMenu', {
        value: globalContextMenu,
        writable: false,
        configurable: false,
    });
}

Object.defineProperty(globalContextMenu, 'debug', {
    value: (b: boolean): void => {
        Logger.debuggable = b;
    },
    writable: false,
    configurable: false,
});

export {globalContextMenu as ContextMenu, ContextMenuOptions};
export default globalContextMenu as ContextMenu;
