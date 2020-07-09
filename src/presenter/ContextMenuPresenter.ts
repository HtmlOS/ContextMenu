'use strict';

import Point from '../utils/Point';
import ContextMenuItem from '../model/ContextMenuItem';
import {ContextMenuViewGlobal, ContextMenuViewHolder} from '../view/ContextMenuView';
import {ContextMenuOptions, ContextMenu} from '../model/ContextMenu';
import Rect from '../utils/Rect';
import Logger from '../utils/Logger';
import Utils from '../utils/Utils';
import HashMap from '../model/HashMap';

class ContextMenuPresenter {
    readonly event: MouseEvent;
    readonly menuOptions: ContextMenuOptions;
    readonly menuPosition: Point;
    readonly menuTree: HashMap<string, Array<ContextMenuItem>> = new HashMap();

    postSelectionId: string;
    postSelectionType: 'i' | 'o';
    postSelectionTimerId: NodeJS.Timeout;

    constructor(e: MouseEvent, menuItems: Array<ContextMenuItem>, options?: ContextMenuOptions) {
        this.event = e;
        this.menuPosition = Utils.getMouseEventPoint(e);
        this.processMenuTree(this.menuTree, '0', this.rebuildMenuItems(menuItems));
        this.menuOptions = options || new ContextMenuOptions();
        Logger.debug('generate menu tree : ', menuItems, this.menuTree);
    }

    private rebuildMenuItems(menuItems: Array<ContextMenuItem>): Array<ContextMenuItem> {
        const rebuild = (oldItems: Array<ContextMenuItem>): Array<ContextMenuItem> => {
            const newItems: Array<ContextMenuItem> = new Array<ContextMenuItem>();
            for (const item of oldItems) {
                newItems.push(new ContextMenuItem().assgin(item));
            }
            return newItems;
        };

        const newItems: Array<ContextMenuItem> = rebuild(menuItems);
        for (const item of newItems) {
            if (item && item.children) {
                item.children = rebuild(item.children);
            }
        }
        return newItems;
    }

    private processMenuTree(
        menuTree: HashMap<string, Array<ContextMenuItem>>,
        menuId: string,
        menuItems: Array<ContextMenuItem>
    ): void {
        if (!menuItems) {
            return;
        }
        menuTree.set(menuId, menuItems);

        let index = 0;
        for (const i in menuItems) {
            const item = menuItems[i];
            if (item && !item.isDivider()) {
                if (item.children) {
                    this.processMenuTree(menuTree, menuId + ',' + index, item.children);
                }
                index++;
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

        const menuStacks = ContextMenuViewGlobal.getMenuStacks();
        const newIds: Array<string> = newIdMap.keys();
        const oldIds: Array<string> = menuStacks.keys();

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
        const menuStacks = ContextMenuViewGlobal.getMenuStacks();
        menuStacks.forEach((value, key) => {
            if (key.indexOf(id) >= 0) {
                value.hide();
                menuStacks.delete(key);
            }
        });
    }

    private showMenuStack(ids: Array<string>): void {
        ids.sort();
        Logger.debug('menu show stacks :', ids);

        const menuStacks = ContextMenuViewGlobal.getMenuStacks();

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
            const menuItems = this.menuTree.get(id);
            if (!menuItems) {
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
                    if (item.isEnabled() && item.onclick) {
                        ContextMenu.hide();
                        item.onclick(index, item);
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
            menuView.rootView.onmouseenter = (e: Event): void => {
                Utils.preventEvent(e);
                this.postSelection('i', id);
            };
            menuView.rootView.onmouseleave = (e: Event): void => {
                Utils.preventEvent(e);
                this.postSelection('o', '0');
            };

            if (!hasParent) {
                menuView.show(new Rect(this.menuPosition.x, this.menuPosition.y, 0, 0));
            } else if (parentView === undefined) {
                return;
            } else {
                const anchorRect = parentView.itemViewRects.get(parentIndex);
                if (!anchorRect) {
                    return;
                }
                menuView.show(anchorRect);
            }

            return;
        }
    }

    private postSelection(type: 'i' | 'o', id: string): void {
        Logger.debug('menu post stacks : id =', id);
        if (type === 'i' && this.postSelectionType === type && this.postSelectionId.indexOf(id) >= 0) {
            // 优化鼠标事件的响应顺序, 父元素进入子元素时, 响应 id 最长的
            return;
        }
        clearTimeout(this.postSelectionTimerId);

        this.postSelectionType = type;
        this.postSelectionId = id;
        this.postSelectionTimerId = setTimeout(() => {
            this.showMenu(id);
        }, 10);
    }
}

export default ContextMenuPresenter;
