'use strict';

ContextMenu.debug(true);

const toast = function (index, item) {
    alert(index + ' => ' + JSON.stringify(item, null, 2));
};

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: 'reload',
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
        onclick: toast,
    },
    {
        name: 'paste',
        icon: './icon/paste.png',
        hotkey: 'ctrl+v',
        onclick: toast,
    },
    {},
    {
        name: 'new',
        hotkey: '',
        children: [
            {
                name: 'file',
                onclick: toast,
            },
            {
                name: 'folder',
                onclick: toast,
            },
        ],
    },
    {},
    {
        name: 'about',
        icon: './icon/about.png',
    },
];

const lang_zh = {
    reload: '刷新',
    copy: '复制',
    paste: '粘贴',
    about: '关于',
    new: '新建',
};

menulist[0].children = menulist;

function hasClass(ele, cls) {
    return ele.className.match('(\\s|^)' + cls + '(\\s|$)');
}
//为指定的dom元素添加样式
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        ele.className = ele.className.replace('(\\s|^)' + cls + '(\\s|$)', ' ');
    }
}

const body = document.getElementsByTagName('body')[0];
const terminal = document.getElementById('terminal');
const radios = [
    document.getElementById('radio_default'),
    document.getElementById('radio_light'),
    document.getElementById('radio_dark'),
];
const radio_zh = document.getElementById('radio_zh');

ContextMenu.config({
    i18n: function (s) {
        return radio_zh.checked ? lang_zh[s] : s;
    },
});

body.oncontextmenu = function (e) {
    for (let i in radios) {
        const radio = radios[i];
        removeClass(body, radio.value);
        if (radio.checked) {
            addClass(body, radio.value);
        }
    }
    ContextMenu.show(menulist);
};
