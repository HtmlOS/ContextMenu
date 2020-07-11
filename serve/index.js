'use strict';

ContextMenu.debug(true);

const toast = function (index, item) {
    alert(index + ' => ' + JSON.stringify(item, null, 2));
};

// const menulist = [{name: 'cut'}];
const menulist = [
    {
        name: '刷新',
        icon: './icon/refresh.png',
        onclick: toast,
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
        name: '新建',
        hotkey: '',
        children: [
            {
                name: '文件',
                onclick: toast,
            },
            {
                name: '文件夹',
                onclick: toast,
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

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
//为指定的dom元素添加样式
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'); //正则表达式，需要补血
        ele.className = ele.className.replace(reg, ' ');
    }
}

const body = document.getElementsByTagName('body')[0];
body.oncontextmenu = function (e) {
    const radios = document.getElementsByName('theme');
    for (let i in radios) {
        let radio = radios[i];
        removeClass(body, radio.value);
        if (radio.checked) {
            addClass(body, radio.value);
        }
    }
    ContextMenu.show(menulist);
};
