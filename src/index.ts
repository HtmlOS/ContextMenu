'use strict';

import { ContextMenu } from "./model/ContextMenu";
import "./view/ContextMenu.css"

Object.defineProperty(window, 'ContextMenu', {
    value: ContextMenu,
    writable: false,
    configurable: false,
});

exports.default = ContextMenu;
