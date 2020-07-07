'use strict';

import {
    CONTEXTMENU_STYLE,
    CONTEXTMENU_STYLE_ITEM_NORMAL,
    CONTEXTMENU_STYLE_ITEM_SELECTED,
    CONTEXTMENU_STYLE_ITEM_DISABLED,
    CONTEXTMENU_STYLE_ITEM_DIVIDER,
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

interface OnStateChangedListening {
    onSelected(index: number): void;
    onRenderStart(): void;
    onRenderStop(costTime: number): void;
}

class ContextMenuView {
    readonly options: ContextMenuOptions;
    readonly id: string;
    readonly items: Array<ContextMenuItem>;

    readonly rootView: HTMLElement;
    readonly rootViewRect: Rect = new Rect(0, 0, 0, 0);
    readonly itemViewRects: Map<number, Rect> = new Map();
    readonly itemViewHeight: number;
    readonly deviderViewHeight: number;

    onStateChangedListener: OnStateChangedListening;

    constructor(id: string, items: Array<ContextMenuItem>, options: ContextMenuOptions) {
        this.id = id;
        this.items = items;
        this.options = options;
        this.rootView = this.generateMenuView();

        this.deviderViewHeight = this.getItemHeight('divider');
    }

    hide(): void {
        const view = this.rootView;
        document.body.removeChild(view);
    }

    private generateItemView(index: number, item: ContextMenuItem): HTMLElement {
        const itemView: HTMLElement = document.createElement('div');

        itemView.className = item.enabled === true ? CONTEXTMENU_STYLE_ITEM_NORMAL : CONTEXTMENU_STYLE_ITEM_DISABLED;

        const itemHotkeyPlaceHolderChars: string = this.getItemHotkeyPlaceHolderChars();

        const hasChildren: boolean = item.children !== undefined && item.children.length > 0;
        const showArrow: boolean = hasChildren;
        const showHotkey: boolean = !hasChildren && item.hotkey !== undefined && item.hotkey.length > 0;
        const showHotKeyPlaceHolder: boolean = itemHotkeyPlaceHolderChars.length > 0;

        const itemIcon: string =
            item.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const itemName: string =
            this.options && this.options.i18n ? this.options.i18n(item.name) || item.name || '' : item.name || '';
        const itemHotkey: string = item.hotkey || '';

        if (this.isDivider(item)) {
            itemView.innerHTML = `
                    <div class="${CONTEXTMENU_STYLE_ITEM_DIVIDER}"></div>
                    `;
        } else {
            itemView.innerHTML = `

            <img class="${CONTEXTMENU_STYLE_ITEM_ICON}" src="${itemIcon}" draggable="false" />
        
            <div class="${CONTEXTMENU_STYLE_ITEM_TEXT}">${itemName}</div>
        
            <div class="${CONTEXTMENU_STYLE_ITEM_HOTKEY}"
                style="display:${showHotkey ? 'block' : 'none'}">
                ${itemHotkey}
            </div>

            <div class="${CONTEXTMENU_STYLE_ITEM_HOTKEY}"
                style="display:${showHotKeyPlaceHolder ? 'block' : 'none'};
                        visibility: ${showHotKeyPlaceHolder ? 'visible' : 'hidden'};
                        opacity: 0; filter:alpha(opacity=0);">
                ${itemHotkeyPlaceHolderChars}
            </div>
            
            <div class="${CONTEXTMENU_STYLE_ITEM_ARROW}"
                style="display:'block'; visibility: ${showArrow ? 'visible' : 'hidden'}"
            </div>
            
        `;
        }

        if (item.enabled === true && this.onStateChangedListener) {
            itemView.onmouseenter = ((index: number, hook: (index: number) => void) => {
                return (): void => {
                    hook(index);
                };
            })(index, this.onStateChangedListener.onSelected);
        }
        if (item.enabled === true && item.onclick) {
            itemView.onclick = ((
                index: number,
                item: ContextMenuItem,
                hook: (index: number, item: ContextMenuItem) => void
            ) => {
                return (): void => {
                    hook(index, item);
                };
            })(index, item, item.onclick);
        }
        return itemView;
    }

    private generateMenuView(): HTMLElement {
        Logger.debug('menu view generate start');

        const menuView: HTMLElement = document.createElement('div');

        menuView.className = CONTEXTMENU_STYLE;

        menuView.style.position = 'fixed';
        menuView.style.width = 'auto';
        menuView.style.height = 'auto';
        menuView.style.zIndex = '9999999999';
        menuView.style.top = 0 + 'px';
        menuView.style.left = 0 + 'px';
        menuView.style.margin = 0 + 'px'; // 使 css 的 margin 属性失效

        for (const i in this.items) {
            const item: ContextMenuItem = this.items[i];
            const itemView = this.generateItemView(parseInt(i), item);
            menuView.appendChild(itemView);
        }

        Logger.debug('menu view generate end');
        return menuView;
    }

    public show(anchor: Rect): void {
        const view = this.rootView;

        view.style.visibility = 'hidden';

        Logger.debug('menu view render start');
        const timeRenderStart = new Date().getTime();
        if (this.onStateChangedListener) {
            this.onStateChangedListener.onRenderStart();
        }

        document.body.appendChild(view);

        const reandering = (): void => {
            setTimeout(() => {
                if (!view.offsetWidth || !view.offsetHeight) {
                    reandering();
                    Logger.debug('menu view rendering');
                    return;
                }

                const width: number = view.offsetWidth;
                const height: number = view.offsetHeight;

                Logger.debug('menu view sized: ', width + 'x' + height);

                Object.assign(this.rootViewRect, new Rect(0, 0, width, height));

                this.computeItemRects();

                const menuRect: Rect = this.fixedLocation(anchor);

                Object.assign(this.rootViewRect, menuRect);
                Logger.debug('menu view fixed: ', this.rootViewRect.w + 'x' + this.rootViewRect.h, this.rootViewRect);

                view.style.width = menuRect.w + 'px';
                view.style.height = menuRect.h + 'px';
                view.style.top = menuRect.t + 'px';
                view.style.left = menuRect.l + 'px';
                view.style.visibility = 'visible';

                this.computeItemRects();

                const timeRenderStop = new Date().getTime();
                const timeRenderCost = timeRenderStop - timeRenderStart;
                Logger.debug('menu view end : cost ' + timeRenderCost + 'ms');
                if (this.onStateChangedListener) {
                    this.onStateChangedListener.onRenderStop(timeRenderCost);
                }
            }, 10);
        };
        reandering();
    }

    private computeItemRects(): void {
        const mL = this.rootViewRect.l;
        const mW = this.rootViewRect.w;
        let index = 0;
        Utils.visitElemementChildren(this.rootView, (_, element) => {
            if (element.childNodes.length === 1) {
                // is divider
                return;
            }
            const elementRect = element.getBoundingClientRect();
            this.itemViewRects.set(index++, new Rect(mL, elementRect.top, mW, elementRect.height));
            Logger.debug('visitElemementChildren', index, element, element.getBoundingClientRect());
        });
    }

    private fixedLocation(anchor: Rect): Rect {
        const clientRect: Rect = Utils.getClientRect();
        Logger.debug('menu view fix location start: screen rect = ', clientRect, 'anchor rect = ', anchor);

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
        Logger.debug('dock @', dockW, dockH);

        let preX: number;
        let preY: number;
        let preW: number;
        let preH: number;

        switch (dockW) {
            case 'left':
                preW = Math.min(mW, spaceL);
                preX = aL - preW;
                break;
            case 'right':
                preW = Math.min(mW, spaceR);
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
                preY = sT + preH;
                break;
            case 'bottom':
                preH = Math.min(mH, sH);
                preY = sB - preH;
                break;
        }

        const rect: Rect = new Rect(preX, preY, preW, preH);

        Logger.debug('menu view fix location end: menu rect = ', rect);
        return rect;
    }

    private getItemHeight(type: 'divider' | 'item'): number {
        let menuMock = new ContextMenuItem();
        switch (type) {
            case 'divider':
                menuMock.name = '';
                break;
            case 'item':
                menuMock.name = 'mock';
                break;
            default:
                return 0;
        }
        const div = this.generateItemView(0, menuMock);
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
        const style = window.getComputedStyle(div);
        const h = parseInt(style.height) || 0;
        const p = (parseInt(style.paddingTop) || 0) + (parseInt(style.paddingBottom) || 0);
        const m = (parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0);
        document.body.removeChild(div);
        const height = h + p + m;
        Logger.debug(`compute ${type} height : ${height}= ${h} + ${p} + ${m}`, div);
        return height;
    }

    private isDivider(item: ContextMenuItem): boolean {
        return !item.name || item.name.trim().length === 0;
    }

    private getItemHotkeyPlaceHolderChars(): string {
        let chars = '';
        for (const item of this.items) {
            if (item && item.hotkey && item.hotkey.length > chars.length) {
                chars = item.hotkey;
            }
        }
        return chars;
    }
}

export default ContextMenuView;
