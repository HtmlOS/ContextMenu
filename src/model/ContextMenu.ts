'use strict';

import ContextMenuPresenter from '../presenter/ContextMenuPresenter';

class ContextMenuOptions {
    i18n: (key: string) => string = (key: string) => {
        return key;
    };
}

class ContextMenu {
    static options?: ContextMenuOptions;
    static presenter?: ContextMenuPresenter ;

    static init(globalOptions?: ContextMenuOptions): void {
        ContextMenu.options = globalOptions;
    }

    static hide(): void {
        const e = window.event;
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
        }
    }

    static show(menu: ContextMenu, options?: ContextMenuOptions): void {
        const e = window.event;
        if (!e) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        ContextMenu.hide();
    }
}

export {ContextMenu, ContextMenuOptions};
