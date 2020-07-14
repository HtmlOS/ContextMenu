'use strict';

import ContextMenuOptions from './ContextMenuOptions';

class ContextMenuStyle {
    readonly contextmenu: string;
    readonly contextmenuIn: [string, number];
    readonly contextmenuOut: [string, number];

    readonly contextmenuDivider: string;

    readonly contextmenuItem: string;
    readonly contextmenuItemSelected: string;
    readonly contextmenuItemDisabled: string;

    readonly contextmenuItemIcon: string;
    readonly contextmenuItemName: string; //
    readonly contextmenuItemHotkey: string;
    readonly contextmenuItemArrow: string;

    constructor(options: ContextMenuOptions) {
        const style = options.style;
        this.contextmenu = style?.contextmenu || 'contextmenu';

        const contextmenuIn: {name: string; time: number} = {name: 'contextmenu-in', time: 0};
        const contextmenuOut: {name: string; time: number} = {name: 'contextmenu-out', time: 0};

        if (style?.contextmenuIn) {
            if (style.contextmenuIn.length > 0) {
                const name = style.contextmenuIn[0];
                contextmenuIn.name = name || contextmenuIn.name;
            }
            if (style.contextmenuIn.length > 1) {
                const time = style.contextmenuIn[1];
                contextmenuIn.time = isNaN(time) ? contextmenuIn.time : time;
            }
        }
        if (style?.contextmenuOut) {
            if (style.contextmenuOut.length > 0) {
                const name = style.contextmenuOut[0];
                contextmenuOut.name = name || contextmenuOut.name;
            }
            if (style.contextmenuOut.length > 1) {
                const time = style.contextmenuOut[1];
                contextmenuOut.time = isNaN(time) ? contextmenuOut.time : time;
            }
        }
        this.contextmenuIn = [contextmenuIn.name, contextmenuIn.time];
        this.contextmenuOut = [contextmenuOut.name, contextmenuOut.time];

        this.contextmenuDivider = style?.contextmenuDivider || 'contextmenu-divider';

        this.contextmenuItem = style?.contextmenuItem || 'contextmenu-item';
        this.contextmenuItemSelected = style?.contextmenuItemSelected || 'contextmenu-item-selected';
        this.contextmenuItemDisabled = style?.contextmenuItemDisabled || 'contextmenu-item-disabled';

        this.contextmenuItemIcon = style?.contextmenuItemIcon || 'contextmenu-item-icon';
        this.contextmenuItemName = style?.contextmenuItemName || 'contextmenu-item-name';
        this.contextmenuItemHotkey = style?.contextmenuItemHotkey || 'contextmenu-item-hotkey';
        this.contextmenuItemArrow = style?.contextmenuItemArrow || 'contextmenu-item-arrow';
    }
}

export default ContextMenuStyle;
