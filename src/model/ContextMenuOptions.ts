'use strict';

class ContextMenuOptions {
    layer?: HTMLElement;
    style?: {
        contextmenu?: string;
        contextmenuIn?: [string, number];
        contextmenuOut?: [string, number];

        contextmenuDivider?: string;

        contextmenuItem?: string;
        contextmenuItemSelected?: string;
        contextmenuItemDisabled?: string;

        contextmenuItemIcon?: string;
        contextmenuItemName?: string;
        contextmenuItemHotkey?: string;
        contextmenuItemArrow?: string;
    };
    i18n: (key: string) => string;

    constructor(option?: ContextMenuOptions) {
        ContextMenuOptions.assgin(this, {
            layer: document.body,
            i18n: (s): string => {
                return s;
            },
        });
        ContextMenuOptions.assgin(this, option);
    }

    static assgin(to: ContextMenuOptions, from?: ContextMenuOptions): void {
        if (!from || !to) {
            return;
        }
        to.layer = from.layer || to.layer;
        to.i18n = from.i18n || to.i18n;

        if (!from.style) {
            return;
        }
        if (!to.style) {
            to.style = from.style;
            return;
        }
        to.style.contextmenu = from.style.contextmenu || to.style.contextmenu;
        to.style.contextmenuIn = from.style.contextmenuIn || to.style.contextmenuIn;
        to.style.contextmenuOut = from.style.contextmenuOut || to.style.contextmenuOut;

        to.style.contextmenuDivider = from.style.contextmenuDivider || to.style.contextmenuDivider;

        to.style.contextmenuItem = from.style.contextmenuItem || to.style.contextmenuItem;
        to.style.contextmenuItemSelected = from.style.contextmenuItemSelected || to.style.contextmenuItemSelected;
        to.style.contextmenuItemDisabled = from.style.contextmenuItemDisabled || to.style.contextmenuItemDisabled;

        to.style.contextmenuItemIcon = from.style.contextmenuItemIcon || to.style.contextmenuItemIcon;
        to.style.contextmenuItemName = from.style.contextmenuItemName || to.style.contextmenuItemName;
        to.style.contextmenuItemHotkey = from.style.contextmenuItemHotkey || to.style.contextmenuItemHotkey;
        to.style.contextmenuItemArrow = from.style.contextmenuItemArrow || to.style.contextmenuItemArrow;
    }
}

export default ContextMenuOptions;
