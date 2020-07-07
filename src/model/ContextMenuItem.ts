'use strict';

class ContextMenuItem {
    name: string;
    children?: Array<ContextMenuItem>;
    icon?: string;
    hotkey?: string;
    disabled?: boolean;
    onclick?: (index: number, item: ContextMenuItem) => void;
}

export default ContextMenuItem;
