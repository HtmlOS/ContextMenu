'use strict';

import './theme/default/index.css';

import {ContextMenu} from './model/ContextMenu';
import ContextMenuMonitor from './presenter/ContextMenuMonitor';

Object.defineProperty(window, 'ContextMenu', {
    value: ContextMenu,
    writable: false,
    configurable: false,
});

ContextMenuMonitor.start();

export default ContextMenu;
