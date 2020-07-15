'use strict';

ContextMenu.debug(true);

var toast = function (index, item) {
    alert(index + ' => ' + JSON.stringify(item, null, 2));
};

// const menulist = [{name: 'cut'}];
var menulist = [
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

var lang_zh = {
    reload: '刷新',
    copy: '复制',
    paste: '粘贴',
    about: '关于',
    new: '新建',
    file: '文件',
    folder: '文件夹',
};

menulist[0].children = menulist;

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
//为指定的dom元素添加样式
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className += ' ' + cls;
    }
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
    }
}

var body = document.getElementsByTagName('body')[0];
var terminal = document.getElementById('terminal');
var radios = [
    document.getElementById('radio_theme_default'),
    document.getElementById('radio_theme_light'),
    document.getElementById('radio_theme_dark'),
];
var radio_lang_zh = document.getElementById('radio_lang_zh');

var radio_animate_none = document.getElementById('radio_animate_none');
var radio_animate_fade = document.getElementById('radio_animate_fade');

ContextMenu.config({
    i18n: function (s) {
        return radio_lang_zh.checked ? lang_zh[s] : s;
    },
    style: {
        contextmenuIn: ['fade-in', 200],
        contextmenuOut: ['fade-out', 200],
    },
});

body.oncontextmenu = function (e) {
    for (var i in radios) {
        var radio = radios[i];
        if (radio.checked) {
            addClass(body, radio.value);
        } else {
            removeClass(body, radio.value);
        }
    }
    var contextmenuIn = [];
    var contextmenuOut = [];
    if (radio_animate_none.checked) {
        contextmenuIn = ['contextmenu-in', 0];
        contextmenuOut = ['', 0];
    }
    if (radio_animate_fade.checked) {
        contextmenuIn = ['fade-in', 500];
        contextmenuOut = ['fade-out', 500];
    }
    ContextMenu.config({
        style: {
            contextmenuIn: contextmenuIn,
            contextmenuOut: contextmenuOut,
        },
    });
    ContextMenu.show(menulist);
};
