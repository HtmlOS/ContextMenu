'use strict';

import './theme/default/index.css';

import {ContextMenu, ContextMenuOptions} from './model/ContextMenu';

const contextMenuGlobal = new ContextMenu();
if (window) {
    Object.defineProperty(window, 'ContextMenu', {
        value: contextMenuGlobal,
        writable: false,
        configurable: false,
    });
}

export {contextMenuGlobal as ContextMenu, ContextMenuOptions};
