'use strict';

import Utils from '../utils/Utils';

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

    assgin(item: ContextMenuItem): ContextMenuItem {
        Utils.assignObject(this, item);
        return this;
    }

    isDivider(): boolean {
        return (!this.name || this.name.trim().length === 0) && !(this.children && this.children.length === 0);
    }

    isEnabled(): boolean {
        return this.disabled !== true;
    }
}

export default ContextMenuItem;
