'use strict';

import {
    CONTEXTMENU_STYLE,
    CONTEXTMENU_STYLE_ITEM_NORMAL,
    CONTEXTMENU_STYLE_ITEM_SELECTED,
    CONTEXTMENU_STYLE_ITEM_DISABLED,
    CONTEXTMENU_STYLE_DIVIDER,
    CONTEXTMENU_STYLE_ITEM_ICON,
    CONTEXTMENU_STYLE_ITEM_TEXT,
    CONTEXTMENU_STYLE_ITEM_HOTKEY,
    CONTEXTMENU_STYLE_ITEM_ARROW,
} from './ContextMenuStyle';
import {ContextMenuOptions} from '../model/ContextMenu';
import ContextMenuItem from '../model/ContextMenuItem';
import Rect from '../utils/Rect';
import Utils from '../utils/Utils';
import Logger from '../utils/Logger';
import HashMap from '../model/compatible/CMap';
import CHTMLElement from '../model/compatible/CHTMLElement';

interface OnStateChangedListening {
    onSelected(index: number): void;
    onClicked(index: number, item: ContextMenuItem): void;
    onRenderStart(): void;
    onRenderStop(costTime: number): void;
}

class ContextMenuViewHolder {
    readonly options: ContextMenuOptions;
    readonly id: string;
    readonly items: Array<ContextMenuItem>;

    readonly rootView: HTMLElement;
    readonly rootViewRect: Rect = new Rect(0, 0, 0, 0);
    readonly itemViewRect: Rect = new Rect(0, 0, 0, 0);
    readonly itemViewRects: HashMap<number, Rect> = new HashMap();

    onStateChangedListening: OnStateChangedListening;

    constructor(id: string, items: Array<ContextMenuItem>, options: ContextMenuOptions) {
        this.id = id;
        this.items = items;
        this.options = options;
        this.rootView = this.generateMenuView();
    }

    get onStateChangedListener(): OnStateChangedListening {
        return this.onStateChangedListening;
    }

    set onStateChangedListener(listener: OnStateChangedListening) {
        this.onStateChangedListening = listener;
        this.updateStateChangedListener();
    }

    public select(index?: number): void {
        this.visitItems((i, element, item) => {
            this.updateItemViewClass(item, element, i === index);
        });
    }

    public hide(): void {
        const view = this.rootView;
        const layer = this.options?.layer || document.body;
        layer.removeChild(view);
    }

    public show(anchor: Rect): void {
        const view = this.rootView;

        view.style.visibility = 'hidden';

        Logger.debug('menu view render start : anchor rect =', anchor);
        const timeRenderStart = new Date().getTime();
        if (this.onStateChangedListener !== undefined) {
            this.onStateChangedListener.onRenderStart();
        }

        const layer = this.options?.layer || document.body;
        layer.appendChild(view);

        const reandering = (): void => {
            setTimeout(() => {
                if (!layer.contains(view)) {
                    Logger.debug('menu view destroyed');
                    return;
                }
                if (!view.offsetWidth || !view.offsetHeight) {
                    reandering();
                    Logger.debug('menu view rendering');
                    return;
                }

                const width: number = view.offsetWidth;
                const height: number = view.offsetHeight;

                Logger.debug('menu view init size: ', width + 'x' + height);

                this.rootViewRect.assign(new Rect(0, 0, width, height));

                // init compute
                this.computeItemRects();

                const paddingW = width - this.itemViewRect.w;
                const paddingH = height - this.itemViewRect.h;

                Logger.debug('menu view padding: ', paddingW, paddingH);
                const menuRect: Rect = this.fixedLocation(anchor);

                this.rootViewRect.assign(menuRect);
                Logger.debug('menu view fixed: ', this.rootViewRect.w + 'x' + this.rootViewRect.h, this.rootViewRect);

                const fixedW = menuRect.w - paddingW;
                const fixedH = menuRect.h - paddingH;
                view.style.width = fixedW + 'px';
                view.style.height = fixedH + 'px';
                view.style.top = menuRect.t + 'px';
                view.style.left = menuRect.l + 'px';

                const timeRenderStop = new Date().getTime();
                const timeRenderCost = timeRenderStop - timeRenderStart;
                Logger.debug('menu view render end : cost ' + timeRenderCost + 'ms');

                // fixed compute
                setTimeout(() => {
                    if (!layer.contains(view)) {
                        Logger.debug('menu view destroyed');
                        return;
                    }
                    view.style.visibility = 'visible';
                    this.computeItemRects();
                    if (this.onStateChangedListener !== undefined) {
                        this.onStateChangedListener.onRenderStop(timeRenderCost);
                    }
                }, 10);
            }, 10);
        };
        reandering();
    }

    private updateStateChangedListener(): void {
        this.visitItems((index, view, item) => {
            if (this.onStateChangedListener !== undefined) {
                view.element.onmouseover = ((index: number, hook: (index: number) => void) => {
                    return (): void => {
                        hook(index);
                    };
                })(index, this.onStateChangedListener.onSelected);
                view.element.onmouseleave = ((index: number, hook: (index: number) => void) => {
                    return (): void => {
                        hook(-1);
                    };
                })(index, this.onStateChangedListener.onSelected);

                view.element.onclick = ((
                    index: number,
                    item: ContextMenuItem,
                    hook: (index: number, item: ContextMenuItem) => void
                ) => {
                    return (e: Event): void => {
                        Utils.preventEvent(e);
                        hook(index, item);
                    };
                })(index, item, this.onStateChangedListener.onClicked);
            }
        });
    }

    private generateMenuView(): HTMLElement {
        const menuView: HTMLElement = document.createElement('table');

        menuView.className = CONTEXTMENU_STYLE;

        menuView.id = this.id;

        menuView.setAttribute('border', '0');
        menuView.setAttribute('cellspacing', '0');
        menuView.setAttribute('cellpadding', '0');
        menuView.style.margin = '0px';

        menuView.style.position = 'fixed'; // 生成绝对定位的元素，相对于浏览器窗口进行定位。
        menuView.style.width = 'auto';
        menuView.style.height = 'auto';
        menuView.style.zIndex = '2147483647';
        menuView.style.top = 0 + 'px';
        menuView.style.left = 0 + 'px';

        for (const i in this.items) {
            const item: ContextMenuItem = this.items[i];
            const itemView = this.generateItemView(item);
            this.updateItemViewClass(item, new CHTMLElement(itemView), false);
            menuView.appendChild(itemView);
        }

        return menuView;
    }

    private generateItemView(item: ContextMenuItem): HTMLElement {
        const itemView: HTMLElement = document.createElement('tr');

        const showArrow: boolean = ContextMenuItem.hasArrow(item);
        const showHotkey: boolean = item.hotkey !== undefined && item.hotkey.length > 0;

        const itemIcon: string =
            item.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const itemName: string =
            this.options && this.options.i18n ? this.options.i18n(item.name || '') || item.name || '' : item.name || '';
        const itemHotkey: string = item.hotkey || '';

        if (ContextMenuItem.isDivider(item)) {
            const th: HTMLElement = document.createElement('th');
            th.setAttribute('align', 'center');
            th.setAttribute('colspan', '4');
            th.appendChild(document.createElement('hr'));
            itemView.appendChild(th);
        } else {
            const tdIcon: HTMLElement = document.createElement('td');
            const tdText: HTMLElement = document.createElement('td');
            const tdHotkey: HTMLElement = document.createElement('td');
            const tdArrow: HTMLElement = document.createElement('td');
            itemView.appendChild(tdIcon);
            itemView.appendChild(tdText);
            itemView.appendChild(tdHotkey);
            itemView.appendChild(tdArrow);

            tdIcon.innerHTML = `
                <img class="${CONTEXTMENU_STYLE_ITEM_ICON}" src="${itemIcon}" draggable="false"/>
            `;
            tdText.innerHTML = `
                <div class="${CONTEXTMENU_STYLE_ITEM_TEXT}">${itemName}</div>
            `;
            tdHotkey.innerHTML = `
                <div class="${CONTEXTMENU_STYLE_ITEM_HOTKEY}"
                    style="display:${showHotkey ? 'block' : 'none'}">
                    ${itemHotkey}
                </div>
            `;
            tdArrow.innerHTML = `
                <div class="${CONTEXTMENU_STYLE_ITEM_ARROW}"
                    style="display:${showArrow ? 'block' : 'none'}"></div>
                <div class="${CONTEXTMENU_STYLE_ITEM_ARROW}"
                    style="display:${!showArrow ? 'block' : 'none'}; visibility: hidden"></div>
            `;
        }
        return itemView;
    }

    private updateItemViewClass(item: ContextMenuItem, view: CHTMLElement, selected: boolean): void {
        if (ContextMenuItem.isDivider(item)) {
            view.element.className = CONTEXTMENU_STYLE_DIVIDER;
        } else if (!ContextMenuItem.isEnabled(item)) {
            view.element.className = CONTEXTMENU_STYLE_ITEM_DISABLED;
        } else if (selected) {
            view.element.className = CONTEXTMENU_STYLE_ITEM_SELECTED;
        } else {
            view.element.className = CONTEXTMENU_STYLE_ITEM_NORMAL;
        }
    }

    private computeItemRects(): void {
        let index = 0;
        Utils.visitElemementChildren(this.rootView, (i, element) => {
            const elementRect = element.getBoundingClientRect();
            if (!elementRect) {
                return;
            }
            const item = this.items[i];
            if (!ContextMenuItem.isDivider(item)) {
                const l = elementRect.l;
                const t = elementRect.t;
                const w = elementRect.w;
                const h = elementRect.h;
                this.itemViewRects.set(index++, new Rect(l, t, w, h));
            }

            if (i === 0) {
                this.itemViewRect.t = elementRect.t;
                this.itemViewRect.l = elementRect.l;
                this.itemViewRect.r = elementRect.r;
            }
            this.itemViewRect.b = elementRect.b;

            this.itemViewRect.w = this.itemViewRect.r - this.itemViewRect.l;
            this.itemViewRect.h = this.itemViewRect.b - this.itemViewRect.t;
        });
    }

    private visitItems(callback: (index: number, element: CHTMLElement, item: ContextMenuItem) => void): void {
        let index = 0;
        Utils.visitElemementChildren(this.rootView, (i, element) => {
            const item = this.items[i];
            if (ContextMenuItem.isDivider(item)) {
                return;
            }
            callback(index++, element, item);
        });
    }

    private fixedLocation(anchor: Rect): Rect {
        const clientRect: Rect = Utils.getClientRect(4);

        Logger.debug('menu view fix location: screen rect = ', clientRect);

        const mW: number = this.rootViewRect.w;
        const mH: number = this.rootViewRect.h;

        const aL: number = anchor.l;
        const aT: number = anchor.t;
        const aR: number = anchor.r;
        const aB: number = anchor.b;

        const sH: number = clientRect.h;
        const sL: number = clientRect.l;
        const sT: number = clientRect.t;
        const sR: number = clientRect.r;
        const sB: number = clientRect.b;

        const spaceL = aL - sL;
        const spaceR = sR - aR;

        const spaceU = aB - sT;
        const spaceD = sB - aT;

        // 停靠在左侧还是右侧
        let dockW: 'left' | 'right';
        if (spaceR >= mW) {
            dockW = 'right';
        } else if (spaceL >= mW) {
            dockW = 'left';
        } else {
            dockW = spaceR >= spaceL ? 'right' : 'left';
        }

        // 向上展开还是向下展开
        let dockH: 'up' | 'down' | 'top' | 'bottom';
        if (spaceD >= mH) {
            dockH = 'down';
        } else if (spaceU >= mH) {
            dockH = 'up';
        } else {
            dockH = spaceD >= spaceU ? 'bottom' : 'top';
        }
        Logger.debug('menu view dock @', dockW, dockH);

        let preX: number;
        let preY: number;
        let preW: number;
        let preH: number;

        switch (dockW) {
            case 'left':
                preW = mW;
                preX = aL - preW;
                break;
            case 'right':
                preW = mW;
                preX = aR;
                break;
        }
        switch (dockH) {
            case 'up':
                preH = mH;
                preY = aB - preH;
                break;
            case 'down':
                preH = mH;
                preY = aT;
                break;
            case 'top':
                preH = Math.min(mH, sH);
                preY = sT;
                break;
            case 'bottom':
                preH = Math.min(mH, sH);
                preY = sB - preH;
                break;
        }

        return new Rect(preX, preY, preW, preH);
    }
}

export {ContextMenuViewHolder};
