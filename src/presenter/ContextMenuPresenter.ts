'use strict';

import Point from '../utils/Point';
import ContextMenuItem from '../model/ContextMenuItem';
import {ContextMenuViewHolder} from '../view/ContextMenuView';
import {ContextMenuOptions} from '../model/ContextMenu';
import Rect from '../utils/Rect';
import Logger from '../utils/Logger';
import Utils from '../utils/Utils';
import HashMap from '../model/HashMap';

class ContextMenuPresenter {
    readonly id: string = new Date().toUTCString();
    readonly event: MouseEvent;
    readonly menuItems: Array<ContextMenuItem>;
    readonly menuOptions: ContextMenuOptions;
    readonly menuPosition: Point;
    readonly menuStacks: HashMap<string, ContextMenuViewHolder> = new HashMap();

    onItemClick?: (index: number, item: ContextMenuItem) => void;

    postSelectionId: string;
    postSelectionType: 'i' | 'o';
    postSelectionTimerId: NodeJS.Timeout;

    destroyed: boolean;

    constructor(e: MouseEvent, menuItems: Array<ContextMenuItem>, options?: ContextMenuOptions) {
        this.event = e;
        this.menuItems = menuItems;
        this.menuPosition = Utils.getMouseEventPoint(e);
        this.menuOptions = options || new ContextMenuOptions();
    }

    private getMenuItemsById(id: string): Array<ContextMenuItem> | undefined {
        if (!id || id === '0') {
            return this.menuItems;
        }
        if (id.indexOf('0') !== 0) {
            return undefined;
        }

        const ids = id.split(',');
        ids.shift();

        let menuItems: Array<ContextMenuItem> = this.menuItems;
        for (const index of ids) {
            let offset = 0;
            for (let item of menuItems) {
                if (ContextMenuItem.isDivider(item)) {
                    continue;
                }
                if (parseInt(index) === offset++) {
                    const children = item?.children;
                    if (children === undefined || children === null) {
                        return undefined;
                    }
                    menuItems = children;
                }
            }
        }
        return menuItems;
    }

    /**
     *
     * @param id 如果为空, 则隐藏所有菜单, 如果指定, 则隐藏指定菜单
     */
    public hideMenu(id?: string): void {
        if (!id) {
            id = '0';
        }
        this.hideMenuStack(id);
    }

    public showMenu(id?: string): void {
        if (!id) {
            id = '0';
        }

        const newIdMap: HashMap<string, string> = new HashMap();
        const splits = id.split(',');

        while (splits.length > 0) {
            const path = splits.join(',');
            newIdMap.set(path, '');
            splits.pop();
        }

        const newIds: Array<string> = newIdMap.keys();
        const oldIds: Array<string> = this.menuStacks.keys();

        /*
         * 如果当前已存在菜单, id 相同的直接使用, 不同的清除
         */

        // Step1, 先移除不需要的菜单
        for (const oldId of oldIds) {
            if (!newIdMap.has(oldId)) {
                Logger.debug('menu remove by id', oldId);
                this.hideMenuStack(oldId);
            }
        }

        // Step2, 显示需要的菜单, 已经存在的直接使用
        this.showMenuStack(newIds);
    }

    private hideMenuStack(id: string): void {
        this.menuStacks.forEach((value, key) => {
            if (key.indexOf(id) >= 0) {
                value.hide();
                this.menuStacks.delete(key);
            }
        });
    }

    private showMenuStack(ids: Array<string>): void {
        ids.sort();

        Logger.debug('menu show stacks :', ids);
        const menuStacks = this.menuStacks;

        for (const id of ids) {
            // 已经存在的, 不做处理

            const hasParent = id.indexOf(',') >= 0;
            const parentIndex = parseInt(!hasParent ? id : id.substr(id.lastIndexOf(',') + 1));
            const parentId = !hasParent ? undefined : id.substr(0, id.lastIndexOf(','));
            const parentView = parentId === undefined ? undefined : menuStacks.get(parentId);

            if (parentView !== undefined) {
                parentView.select(parentIndex);
            }

            const exist = menuStacks.get(id);
            if (exist !== undefined) {
                exist.select(-1);
                continue;
            }

            // 生成新的
            const menuItems = this.getMenuItemsById(id);
            if (!menuItems) {
                Logger.debug('menu show stacks : no items ');
                return;
            }
            const menuView: ContextMenuViewHolder = new ContextMenuViewHolder(id, menuItems, this.menuOptions);

            menuView.onStateChangedListener = {
                onSelected: (index: number): void => {
                    if (index === -1) {
                        this.postSelection('o', id);
                    } else {
                        this.postSelection('i', id + ',' + index);
                    }
                },
                onClicked: (index: number, item: ContextMenuItem): void => {
                    if (this.onItemClick) {
                        this.onItemClick(index, item);
                    }
                },
                onRenderStart: (): void => {
                    /* */
                },
                onRenderStop: (): void => {
                    this.showMenuStack(ids);
                },
            };
            menuView.rootView.oncontextmenu = (e: Event): void => {
                Utils.preventEvent(e);
            };
            menuView.rootView.onmouseenter = (): void => {
                this.postSelection('i', id);
            };
            menuView.rootView.onmouseleave = (): void => {
                this.postSelection('o', '0');
            };

            const anchorRect =
                parentView === undefined
                    ? new Rect(this.menuPosition.x, this.menuPosition.y, 0, 0)
                    : parentView.itemViewRects.get(parentIndex);
            if (anchorRect && this.isAlive()) {
                Logger.debug('menu show stack :', id);
                menuView.show(anchorRect);
                this.menuStacks.set(id, menuView);
            }
        }
    }

    private postSelection(type: 'i' | 'o', id: string): void {
        if (type === 'i' && this.postSelectionType === type && this.postSelectionId.indexOf(id) >= 0) {
            // 优化鼠标事件的响应顺序, 父元素进入子元素时, 响应 id 最长的
            return;
        }
        Logger.debug('menu post stacks : id =', id);
        clearTimeout(this.postSelectionTimerId);

        this.postSelectionType = type;
        this.postSelectionId = id;
        this.postSelectionTimerId = setTimeout(() => {
            if (this.isDestroyed()) {
                Logger.debug('menu is destroyed');
                return;
            }
            this.showMenu(id);
        }, 10);
    }

    private isAlive(): boolean {
        return !this.isDestroyed();
    }
    private isDestroyed(): boolean {
        return this.destroyed === true;
    }

    public postDestroy(): void {
        this.destroyed = true;
        clearTimeout(this.postSelectionTimerId);
        this.hideMenu();
        setTimeout(() => {
            if (this.menuStacks.size() > 0) {
                this.postDestroy();
            }
        }, 50);
    }
}

export default ContextMenuPresenter;
