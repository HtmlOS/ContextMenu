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
import HashMap from '../model/HashMap';

interface OnStateChangedListening {
    onSelected(index: number): void;
    onClicked(index: number, item: ContextMenuItem): void;
    onRenderStart(): void;
    onRenderStop(costTime: number): void;
}

class ContextMenuViewGlobal {
    static getMenuStacks(): HashMap<string, ContextMenuViewHolder> {
        const elements = document.getElementsByClassName(CONTEXTMENU_STYLE);
        const stacks: HashMap<string, ContextMenuViewHolder> = new HashMap();
        for (let i = 0; i < elements.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = elements[i];
            stacks.put(item.id, item['holder']);
        }
        return stacks;
    }
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
            if (item.isEnabled() && !item.isDivider()) {
                element.className = i !== index ? CONTEXTMENU_STYLE_ITEM_NORMAL : CONTEXTMENU_STYLE_ITEM_SELECTED;
            }
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
                const holder = ContextMenuViewGlobal.getMenuStacks().get(this.id);
                if (holder && holder !== this) {
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
        this.visitItems((index, itemView, item) => {
            if (this.onStateChangedListener !== undefined) {
                itemView.onmouseover = ((index: number, hook: (index: number) => void) => {
                    return (): void => {
                        hook(index);
                    };
                })(index, this.onStateChangedListener.onSelected);
                itemView.onmouseleave = ((index: number, hook: (index: number) => void) => {
                    return (): void => {
                        hook(-1);
                    };
                })(index, this.onStateChangedListener.onSelected);

                itemView.onclick = ((
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

    private generateItemView(item: ContextMenuItem): HTMLElement {
        const itemView: HTMLElement = document.createElement('div');

        if (item.isDivider()) {
            itemView.className = CONTEXTMENU_STYLE_DIVIDER;
        } else if (item.disabled === true) {
            itemView.className = CONTEXTMENU_STYLE_ITEM_DISABLED;
        } else {
            itemView.className = CONTEXTMENU_STYLE_ITEM_NORMAL;
        }

        const hasChildren: boolean = item.children !== undefined && item.children.length > 0;
        const showArrow: boolean = hasChildren;
        const showHotkey: boolean = !hasChildren && item.hotkey !== undefined && item.hotkey.length > 0;

        const itemIcon: string =
            item.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const itemName: string =
            this.options && this.options.i18n ? this.options.i18n(item.name || '') || item.name || '' : item.name || '';
        const itemHotkey: string = item.hotkey || '';

        if (item.isDivider()) {
            itemView.innerHTML = `<hr/>`;
        } else {
            itemView.innerHTML = `
                <img class="${CONTEXTMENU_STYLE_ITEM_ICON}" src="${itemIcon}" draggable="false" />
                <div class="${CONTEXTMENU_STYLE_ITEM_TEXT}">${itemName}</div>
                <div class="${CONTEXTMENU_STYLE_ITEM_HOTKEY}" style="display:${showHotkey ? 'block' : 'none'}">
                    ${itemHotkey}
                </div>
                <div class="${CONTEXTMENU_STYLE_ITEM_ARROW}"
                    style="display:'block'; visibility: ${showArrow ? 'visible' : 'hidden'}"
                </div>
            `;
        }

        return itemView;
    }

    private generateMenuView(): HTMLElement {
        const menuView: HTMLElement = document.createElement('div');

        menuView.className = CONTEXTMENU_STYLE;

        menuView.id = this.id;
        Object.defineProperty(menuView, 'holder', {
            value: this,
            writable: false,
        });

        menuView.style.position = 'fixed'; // 生成绝对定位的元素，相对于浏览器窗口进行定位。
        menuView.style.width = 'auto';
        menuView.style.height = 'auto';
        menuView.style.zIndex = '999999999';
        menuView.style.top = 0 + 'px';
        menuView.style.left = 0 + 'px';

        for (const i in this.items) {
            const item: ContextMenuItem = this.items[i];
            const itemView = this.generateItemView(item);
            menuView.appendChild(itemView);
        }

        return menuView;
    }

    private computeItemRects(): void {
        const mL = this.rootViewRect.l;
        const mW = this.rootViewRect.w;

        let index = 0;
        Utils.visitElemementChildren(this.rootView, (i, element) => {
            const elementRect = element.getBoundingClientRect();
            const item = this.items[i];
            if (!item.isDivider()) {
                const l = mL;
                const t = elementRect.top;
                const w = mW;
                const h = elementRect.height;
                this.itemViewRects.set(index++, new Rect(l, t, w, h));
            }

            if (i === 0) {
                this.itemViewRect.t = elementRect.top;
                this.itemViewRect.l = elementRect.left;
                this.itemViewRect.r = elementRect.right;
            }
            this.itemViewRect.b = elementRect.bottom;

            this.itemViewRect.w = this.itemViewRect.r - this.itemViewRect.l;
            this.itemViewRect.h = this.itemViewRect.b - this.itemViewRect.t;
        });
    }

    private visitItems(callback: (index: number, element: HTMLElement, item: ContextMenuItem) => void): void {
        let index = 0;
        Utils.visitElemementChildren(this.rootView, (i, element) => {
            const item = this.items[i];
            if (item.isDivider()) {
                return;
            }
            callback(index++, element, item);
        });
    }

    private fixedLocation(anchor: Rect): Rect {
        const clientRect: Rect = Utils.getClientRect();
        Logger.debug('menu view fix location start: screen rect = ', clientRect);

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
}

export {ContextMenuViewGlobal, ContextMenuViewHolder};
