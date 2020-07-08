'use strict';

import {ContextMenu} from './model/ContextMenu';
import './view/ContextMenu.css';
import ContextMenuMonitor from './presenter/ContextMenuMonitor';

Object.defineProperty(window, 'ContextMenu', {
    value: ContextMenu,
    writable: false,
    configurable: false,
});

ContextMenuMonitor.start();

export default ContextMenu;
