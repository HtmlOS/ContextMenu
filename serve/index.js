'use strict';

ContextMenu.setDebugMode(true);

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: 'cut',
        icon: './icon/copy.png',
        onclick: function (index, item) {
            alert(index + ' => ' + JSON.stringify(item, null, 2));
            return true; // 默认true, 事件已消费, 关闭菜单
        },
        children: [
            {
                name: 'copy',
                icon: './icon/copy.png',
                onclick: function (index, item) {
                    alert(index + ' => ' + JSON.stringify(item, null, 2));
                },
            },
            {
                name: 'paste',
                icon: './icon/paste.png',
                onclick: function (index, item) {
                    alert(index + ' => ' + JSON.stringify(item, null, 2));
                },
            },
        ],
    },
    {
        name: 'copy',
        icon: './icon/copy.png',
        hotkey: 'ctrl+c',
        onclick: function (index, item) {
            alert(index + ' => ' + JSON.stringify(item, null, 2));
            return false; // 事件未消费, 不会关闭菜单
        },
    },
    {
        name: 'paste',
        icon: './icon/paste.png',
        hotkey: 'ctrl+v',
    },
    {
        name: 'delete',
        hotkey: 'ctrl+d | delete',
        disabled: true,
    },
    {
        name: '',
    },
    {
        name: '属性',
        icon: './icon/about.png',
    },
];

const div = document.getElementsByClassName('root')[0];
div.oncontextmenu = function (e) {
    console.log(e);
    ContextMenu.show(menulist);
};
