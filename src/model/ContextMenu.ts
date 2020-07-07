'use strict';

import ContextMenuPresenter from '../presenter/ContextMenuPresenter';
import Utils from '../utils/Utils';
import ContextMenuItem from './ContextMenuItem';
import Logger from '../utils/Logger';

class ContextMenuOptions {
    i18n?: (key: string) => string;
}

class ContextMenu {
    static options?: ContextMenuOptions;
    static presenter?: ContextMenuPresenter;

    static init(globalOptions?: ContextMenuOptions): void {
        this.options = globalOptions;
    }
    static setDebugMode(b: boolean): void {
        Logger.debuggable = b;
    }

    static hide(): void {
        Logger.debug('hide menu');

        const e = window.event;
        if (e) {
            Utils.preventEvent(e);
        }
        if (this.presenter != undefined) {
            this.presenter.hideMenu();
            this.presenter = undefined;
        }
    }

    static show(menu: Array<ContextMenuItem>, options?: ContextMenuOptions): void {
        const e = window.event;
        if (!e || !(e instanceof MouseEvent)) {
            return;
        } else {
            Utils.preventEvent(e);
        }

        this.hide();

        Logger.debug('show menu', menu);

        this.presenter = new ContextMenuPresenter(Utils.getCurrentEventLocation(e), menu, options || this.options);
        this.presenter.showMenu();
    }
}

export {ContextMenu, ContextMenuOptions};
