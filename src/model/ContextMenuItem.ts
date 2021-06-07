'use strict';

/**
 * menu item
 */
class ContextMenuItem {
    name?: string;
    children?: Array<ContextMenuItem>;
    icon?: string;
    hotkey?: string;
    disabled?: boolean;
    onclick?: (index: number, item: ContextMenuItem) => void;

    static isDivider(item: ContextMenuItem): boolean {
        if (!item) {
            return true;
        }
        if (this.hasArrow(item)) {
            return false;
        }
        if (item.name && item.name.trim().length > 0) {
            return false;
        }
        return true;
    }

    static isEnabled(item: ContextMenuItem): boolean {
        return item.disabled !== true;
    }

    static hasArrow(item: ContextMenuItem): boolean {
        if (!item) {
            return false;
        }
        if (item.children && item.children.length > 0) {
            return true;
        }
        return false;
    }
}

export default ContextMenuItem;
