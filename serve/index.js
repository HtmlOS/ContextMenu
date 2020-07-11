'use strict';

ContextMenu.debug(true);

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: '刷新',
        icon: './icon/refresh.png',
        onclick: function (index, item) {
            window.location.reload();
        },
    },
    {
        name: '####(^_^)####',
        hotkey: 'iii orz',
        disabled: true,
    },
    {},
    {
        name: 'copy',
        icon: './icon/copy.png',
        hotkey: 'ctrl+c',
        onclick: function (index, item) {
            alert(index + ' => ' + JSON.stringify(item, null, 2));
        },
    },
    {
        name: 'paste',
        icon: './icon/paste.png',
        hotkey: 'ctrl+v',
    },
    {},
    {
        name: '新建',
        hotkey: '',
        children: [
            {
                name: '文件',
                onclick: function (index, item) {
                    alert(index + ' => ' + JSON.stringify(item, null, 2));
                },
            },
            {
                name: '文件夹',
                onclick: function (index, item) {
                    alert(index + ' => ' + JSON.stringify(item, null, 2));
                },
            },
        ],
    },
    {},
    {
        name: '关于',
        icon: './icon/about.png',
    },
];

menulist[0].children = menulist;

ContextMenu.config({
    i18n: function (s) {
        return 'i18n(' + s + ')';
    },
});

const body = document.getElementsByTagName('body')[0];
const div = document.getElementsByClassName('menu-demo')[0];
div.oncontextmenu = function (e) {
    const radios = document.getElementsByName('theme');
    for (let i in radios) {
        let radio = radios[i];
        if (radio.checked) {
            body.className = radio.value;
        }
    }
    ContextMenu.show(menulist);
};
