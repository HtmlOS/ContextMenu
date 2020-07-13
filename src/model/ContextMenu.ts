'use strict';

import ContextMenuPresenter from '../presenter/ContextMenuPresenter';
import ContextMenuItem from './ContextMenuItem';
import Logger from '../utils/Logger';
import ContextMenuMonitor from '../presenter/ContextMenuMonitor';
import CEvent from './compatible/CEvent';

class ContextMenuOptions {
    layer?: HTMLElement;
    i18n?: (key: string) => string;
}

/**
 * lib entry
 */
class ContextMenu {
    options?: ContextMenuOptions;
    presenter?: ContextMenuPresenter;
    monitor?: ContextMenuMonitor;

    config(globalOptions?: ContextMenuOptions): void {
        this.options = globalOptions;
    }

    debug(b: boolean): void {
        Logger.debuggable = b;
    }

    hide(): void {
        if (this.monitor) {
            this.monitor.stop();
        }
        if (this.presenter != undefined) {
            Logger.debug('hide menu');
            this.presenter.postDestroy();
            this.presenter = undefined;
        }
    }

    show(menu: Array<ContextMenuItem>, options?: ContextMenuOptions): void {
        const event = new CEvent(window.event);
        if (!event.isMouseEvent()) {
            return;
        } else {
            event.prevent();
        }

        this.hide();

        Logger.debug('show menu', menu, event.getPoint());

        this.presenter = new ContextMenuPresenter(event, menu, options || this.options);
        this.presenter.onItemClick = (index: number, item: ContextMenuItem): void => {
            if (ContextMenuItem.isEnabled(item) && item.onclick) {
                this.hide();
                setTimeout(() => {
                    if (ContextMenuItem.isEnabled(item) && item.onclick) {
                        item.onclick(index, item);
                    }
                }, 10);
            }
        };
        this.presenter.showMenu();
        this.monitor = new ContextMenuMonitor(this);
        this.monitor.start();
    }
}

export {ContextMenu, ContextMenuOptions};
