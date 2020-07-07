'use strict';

class ContextMenuItem {
    name: string;
    children?: Array<ContextMenuItem>;
    icon?: string;
    hotkey?: string;
    diabled?: boolean;
    onclick?: (index: number, item: ContextMenuItem) => void;
}

export default ContextMenuItem;
