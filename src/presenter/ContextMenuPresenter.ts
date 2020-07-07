'use strict';

import Point from '../utils/Point';
import ContextMenuItem from '../model/ContextMenuItem';
import ContextMenuView from '../view/ContextMenuView';
import {ContextMenuOptions} from '../model/ContextMenu';
import Rect from '../utils/Rect';

class ContextMenuPresenter {
    readonly menuOptions: ContextMenuOptions;
    readonly menuPosition: Point;
    readonly menuTree: Map<string, Array<ContextMenuItem>> = new Map();
    readonly menuStacks: Map<string, ContextMenuView> = new Map();

    constructor(position: Point, menuItems: Array<ContextMenuItem>, options?: ContextMenuOptions) {
        this.menuPosition = position;
        this.processMenuTree(this.menuTree, '0', menuItems);
        this.menuOptions = options || new ContextMenuOptions();
    }

    private processMenuTree(
        menuTree: Map<string, Array<ContextMenuItem>>,
        menuId: string,
        menuItems: Array<ContextMenuItem>
    ): void {
        if (menuItems) {
            menuTree.set(menuId, menuItems);
            for (const i in menuItems) {
                const item = menuItems[i];
                if (item && item.children) {
                    menuTree.set(menuId + ',' + i, item.children);
                }
            }
        }
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

    public showMenu(id: string): void {
        if (!id) {
            id = '0';
        }

        const newIdMap: Map<string, string> = new Map();
        for (const index in id.split(',')) {
            const path = Array.from(newIdMap.keys()).concat(index).join(',');
            newIdMap.set(path, index);
        }

        const newIds: Array<string> = Array.from(newIdMap.keys());
        const oldIds: Array<string> = Array.from(this.menuStacks.keys());

        /*
         * 如果当前已存在菜单, id 相同的直接使用, 不同的清除
         */

        // Step1, 先移除不需要的菜单
        for (const oldId of oldIds) {
            if (!newIdMap.has(oldId)) {
                this.hideMenu(oldId);
            }
        }

        // Step2, 显示需要的菜单, 已经存在的直接使用
        this.showMenuStack(newIds);
    }

    private hideMenuStack(id: string): void {
        this.menuStacks.forEach((value, key) => {
            if (key.indexOf('' + id) >= 0) {
                value.hide();
                this.menuStacks.delete(key);
            }
        });
    }
    private showMenuStack(ids: Array<string>): void {
        ids.sort();
        for (const id of ids) {
            // 已经存在的, 不做处理
            if (this.menuStacks.has(id)) {
                continue;
            }
            // 生成新的
            const menuItems = this.menuTree.get(id);
            if (!menuItems) {
                return;
            }
            const menuView: ContextMenuView = new ContextMenuView(id, menuItems, this.menuOptions);

            menuView.onStateChangedListener = {
                onSelected: (index: number): void => {
                    const nextMenuId = id + ',' + index;
                    this.showMenu(nextMenuId);
                },
                onRenderStart: (): void => {},
                onRenderStop: (_): void => {
                    this.showMenuStack(ids);
                },
            };

            if (id.indexOf(',') < 0) {
                menuView.show(new Rect(this.menuPosition.x, this.menuPosition.y, 0, 0));
            } else {
                const index = parseInt(id.substr(id.lastIndexOf(',') + 1));
                const parentId: string = id.substr(0, id.lastIndexOf(','));
                const parentView: ContextMenuView | undefined = this.menuStacks.get(parentId);
                if (!parentView) {
                    return;
                }
                const anchorRect = parentView.itemViewRect.get(index);
                if (!anchorRect) {
                    return;
                }
                menuView.show(anchorRect);
            }
            this.menuStacks.set(id, menuView);

            return;
        }
    }
}

export default ContextMenuPresenter;
