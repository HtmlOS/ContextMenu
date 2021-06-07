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
            for (let v of style.contextmenuIn) {
                if (typeof v === 'number') {
                    contextmenuIn.time = v;
                } else if (typeof v === 'string') {
                    contextmenuIn.name = v;
                }
            }
        }
        if (style?.contextmenuOut) {
            for (let v of style.contextmenuOut) {
                if (typeof v === 'number') {
                    contextmenuOut.time = v;
                } else if (typeof v === 'string') {
                    contextmenuOut.name = v;
                }
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
