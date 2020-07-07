'use strict';

import {ContextMenuOptions} from '../model/ContextMenu';
import ContextMenuItem from '../model/ContextMenuItem';
import Rect from '../utils/Rect';
import Utils from '../utils/Utils';
import Point from '../utils/Point';

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
    readonly itemViewRect: Map<number, Rect> = new Map();

    onStateChangedListener: OnStateChangedListening;

    constructor(id: string, items: Array<ContextMenuItem>, options: ContextMenuOptions) {
        this.id = id;
        this.items = items;
        this.options = options;
        this.rootView = this.generateMenuView();
    }

    hide(): void {}

    private generateMenuView(): HTMLElement {
        const menuView: HTMLElement = document.createElement('div');

        menuView.className = CONTEXTMENU_STYLE;

        menuView.style.position = 'fixed';
        menuView.style.width = 'auto';
        menuView.style.height = 'auto';
        menuView.style.zIndex = '9999999999';
        menuView.style.top = 0 + 'px';
        menuView.style.left = 0 + 'px';

        const itemHotkeyPlaceHolderChars: string = this.getItemHotkeyPlaceHolderChars();

        for (const i in this.items) {
            const item: ContextMenuItem = this.items[i];
            const itemView: HTMLElement = document.createElement('div');

            itemView.className =
                item.enabled === true ? CONTEXTMENU_STYLE_ITEM_NORMAL : CONTEXTMENU_STYLE_ITEM_DISABLED;

            const hasChildren: boolean = item.children !== undefined && item.children.length > 0;
            const showArrow: boolean = hasChildren;
            const showHotkey: boolean = !hasChildren && item.hotkey !== undefined && item.hotkey.length > 0;
            const showHotKeyPlaceHolder: boolean = itemHotkeyPlaceHolderChars.length > 0;

            const itemIcon: string =
                item.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            const itemName: string = this.options ? this.options.i18n(item.name) || item.name || '' : item.name || '';
            const itemHotkey: string = item.hotkey || '';

            if (this.isItemDivider(item)) {
                itemView.innerHTML = `
                        <div class="${CONTEXTMENU_STYLE_ITEM_DIVIDER}"></div>
                        `;
            } else {
                itemView.innerHTML = `

                <img class="${CONTEXTMENU_STYLE_ITEM_ICON}" src="${itemIcon}" draggable="false" />
            
                <div class="${CONTEXTMENU_STYLE}">${itemName}</div>
            
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
                })(parseInt(i), this.onStateChangedListener.onSelected);
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
                })(parseInt(i), item, item.onclick);
            }

            menuView.appendChild(itemView);
        }
        return menuView;
    }

    public show(anchor: Rect): void {
        const view = this.rootView;

        view.style.visibility = 'hidden';

        const timeRenderStart = new Date().getTime();
        if (this.onStateChangedListener) {
            this.onStateChangedListener.onRenderStart();
        }
        document.body.appendChild(view);

        const reandering = (): void => {
            setTimeout(() => {
                if (!view.offsetWidth || !view.offsetHeight) {
                    reandering();
                }
                const width: number = view.offsetWidth + 16;
                const height: number = view.offsetHeight;

                const menuRect: Rect = this.fixedLocation(anchor, width, height);
                Object.assign(this.rootViewRect, menuRect);

                view.style.width = menuRect.w + 'px';
                view.style.height = menuRect.h + 'px';
                view.style.top = menuRect.t + 'px';
                view.style.left = menuRect.l + 'px';
                view.style.visibility = 'visible';

                this.computeItemRects();

                const timeRenderStop = new Date().getTime();
                if (this.onStateChangedListener) {
                    this.onStateChangedListener.onRenderStop(timeRenderStop - timeRenderStart);
                }
            }, 10);
        };
        reandering();
    }

    private computeItemRects(): void {
        const containerView: HTMLElement = this.rootView;
        const containerRect: Rect = this.rootViewRect;

        const dividerHeight: number = this.getItemDividerHeight();
        const devicerCount: number = this.getDividerCount();
        const paddingTop: number = parseInt(containerView.style.paddingTop) || 0;
        const paddingBottom: number = parseInt(containerView.style.paddingBottom) || 0;
        const itemHeight: number =
            (containerRect.h - paddingTop - paddingBottom - dividerHeight * devicerCount) / this.items.length;

        const left: number = containerRect.l;
        const width: number = containerRect.w;

        let lastTop: number = containerRect.t + paddingTop;
        let lastIndex = 0;
        for (const item of this.items) {
            if (this.isItemDivider(item)) {
                lastTop += dividerHeight;
            } else {
                this.itemViewRect.set(lastIndex, new Rect(left, lastTop, width, itemHeight));
                lastTop += itemHeight;
                lastIndex++;
            }
        }
    }

    private fixedLocation(anchor: Rect, width: number, height: number): Rect {
        const screenRect: Rect = Utils.getScreenRect();

        const iW: number = anchor.w;
        const iH: number = anchor.h;

        const aL: number = anchor.l;
        const aT: number = anchor.t;
        const aR: number = anchor.r;
        const aB: number = anchor.b;

        const sH: number = screenRect.h;
        const sL: number = screenRect.l;
        const sT: number = screenRect.t;
        const sR: number = screenRect.r;
        const sB: number = screenRect.b;

        const spaceL = sL - aL;
        const spaceR = sR - aR;

        const spaceU = sT - aB;
        const spaceD = sB - aT;

        // 停靠在左侧还是右侧
        let dockW: 'left' | 'right';
        if (spaceR >= iW) {
            dockW = 'right';
        } else if (spaceL >= iH) {
            dockW = 'left';
        } else {
            dockW = spaceR > spaceL ? 'right' : 'left';
        }

        // 向上展开还是向下展开
        let dockH: 'up' | 'down' | 'top' | 'bottom';
        if (spaceD >= iH) {
            dockH = 'down';
        } else if (spaceU >= iH) {
            dockH = 'up';
        } else {
            dockH = spaceD > spaceU ? 'bottom' : 'top';
        }

        let preX: number;
        let preY: number;
        let preW: number;
        let preH: number;

        switch (dockW) {
            case 'left':
                preW = Math.min(iW, spaceL);
                preX = aL - preW;
                break;
            case 'right':
                preW = Math.min(iW, spaceR);
                preX = aR + preW;
                break;
        }
        switch (dockH) {
            case 'up':
                preH = iH;
                preY = aB - preH;
                break;
            case 'down':
                preH = iH;
                preY = aT + preH;
                break;
            case 'top':
                preH = Math.min(sT + iH, sH);
                preY = sT + preH;
                break;
            case 'bottom':
                preH = Math.min(sB - iH, sH);
                preY = sB - preH;
                break;
        }

        return new Rect(preX, preY, preW, preH);
    }

    private getDividerCount(): number {
        let c = 0;
        for (const item of this.items) {
            if (this.isItemDivider(item)) {
                c += 1;
            }
        }
        return c;
    }

    private getItemDividerHeight(): number {
        const div = document.createElement('div');
        div.className = '${CONTEXTMENU_STYLE_ITEM_DIVIDER}';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
        const style = window.getComputedStyle(div);
        const h = parseInt(style.height || '0');
        const p = parseInt(style.paddingTop || '0') + parseInt(style.paddingBottom || '0');
        const m = parseInt(style.marginTop || '0') + parseInt(style.marginBottom || '0');
        document.body.removeChild(div);
        return h + p + m;
    }

    private isItemDivider(item: ContextMenuItem): boolean {
        return !item.name || item.name.length === 0;
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
