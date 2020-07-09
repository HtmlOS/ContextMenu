'use strict';

ContextMenu.debug(false);

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: 'cut',
        icon: './icon/copy.png',
        onclick: function (index, item) {
            alert(index + ' => ' + JSON.stringify(item, null, 2));
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
        },
    },
    {
        name: 'paste',
        icon: './icon/paste.png',
        hotkey: 'ctrl+v',
        disabled: true,
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
        icon: './icon/about.png',
    },
];

ContextMenu.config({
    i18n: function (s) {
        return 'i18n(' + s + ')';
    },
});

const body = document.getElementsByTagName('body')[0];
const div = document.getElementsByClassName('menu-demo')[0];
div.oncontextmenu = function (e) {
    console.log(e);
    const radios = document.getElementsByName('theme');
    for (let i in radios) {
        let radio = radios[i];
        if (radio.checked) {
            body.className = radio.value;
        }
    }
    ContextMenu.show(menulist);
};
