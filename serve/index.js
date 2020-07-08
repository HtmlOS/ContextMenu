'use strict';

ContextMenu.setDebugMode(true);

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: 'cut',
        icon: './icon/copy.png',
        onclick: function (index, item) {
            console.log(index, item);
        },
        children: [{name: 'copy'}, {name: 'paste'}],
    },
    {
        name: 'copy',
        icon: './icon/copy.png',
        hotkey: 'ctrl+c',
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
