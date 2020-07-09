'use strict';

import ContextMenuPresenter from '../presenter/ContextMenuPresenter';
import Utils from '../utils/Utils';
import ContextMenuItem from './ContextMenuItem';
import Logger from '../utils/Logger';

class ContextMenuOptions {
    layer?: HTMLElement;
    i18n?: (key: string) => string;
}

/**
 * lib entry
 */
class ContextMenu {
    static options?: ContextMenuOptions;
    static presenter?: ContextMenuPresenter;

    static config(globalOptions?: ContextMenuOptions): void {
        this.options = globalOptions;
    }

    static debug(b: boolean): void {
        Logger.debuggable = b;
    }

    static hide(): void {
        const e = window.event;
        if (e) {
            Utils.preventEvent(e);
        }
        if (this.presenter != undefined) {
            Logger.debug('hide menu');
            this.presenter.hideMenu();
            this.presenter = undefined;
        }
    }

    static show(menu: Array<ContextMenuItem>, options?: ContextMenuOptions): void {
        const e = window.event;
        if (!e || !(e instanceof MouseEvent) || !(e.target instanceof HTMLElement)) {
            return;
        } else {
            Utils.preventEvent(e);
        }

        this.hide();

        Logger.debug('show menu', menu);

        this.presenter = new ContextMenuPresenter(e, menu, options || this.options);
        this.presenter.showMenu();
    }
}

export {ContextMenu, ContextMenuOptions};
