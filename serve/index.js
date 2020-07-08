'use strict';

ContextMenu.setDebugMode(true);

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: 'cut',
        onclick: (index, item) => {
            console.log(index, item);
        },
        children: [{name: 'copy'}, {name: 'paste'}],
    },
    {
        name: 'copy',
        hotkey: 'ctrl+c',
    },
    {
        name: 'paste',
        hotkey: 'ctrl+v',
    },
    {
        name: 'delete',
        hotkey: 'ctrl+d | delete',
    },
    {
        name: '',
    },
    {
        name: '属性',
    },
];

const div = document.getElementsByClassName('root')[0];
div.oncontextmenu = function (e) {
    console.log(e);
    ContextMenu.show(menulist);
};
