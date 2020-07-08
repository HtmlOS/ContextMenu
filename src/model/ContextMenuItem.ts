'use strict';

/**
 * menu item
 */
class ContextMenuItem {
    name: string;
    children?: Array<ContextMenuItem>;
    icon?: string;
    hotkey?: string;
    disabled?: boolean;
    onclick?: (index: number, item: ContextMenuItem) => boolean;
}

export default ContextMenuItem;
