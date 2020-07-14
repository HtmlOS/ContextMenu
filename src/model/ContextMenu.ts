'use strict';

import ContextMenuPresenter from '../presenter/ContextMenuPresenter';
import ContextMenuItem from './ContextMenuItem';
import Logger from '../utils/Logger';
import ContextMenuMonitor from '../presenter/ContextMenuMonitor';
import CEvent from './compatible/CEvent';
import ContextMenuOptions from './ContextMenuOptions';

/**
 * lib entry
 */
class ContextMenu {
    options: ContextMenuOptions;
    presenter?: ContextMenuPresenter;
    monitor?: ContextMenuMonitor;

    constructor() {
        this.options = new ContextMenuOptions();
    }

    config(globalOptions?: ContextMenuOptions): void {
        this.options = new ContextMenuOptions(globalOptions);
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

        const customOptions = new ContextMenuOptions();
        ContextMenuOptions.assgin(customOptions, this.options);
        ContextMenuOptions.assgin(customOptions, options);

        this.presenter = new ContextMenuPresenter(event, menu, customOptions);
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

export default ContextMenu;
