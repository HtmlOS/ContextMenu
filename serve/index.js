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
    {name: 'copy'},
    {name: 'paste'},
];

const div = document.getElementsByClassName('root')[0];
console.log('found root div: ', div);
div.oncontextmenu = function (e) {
    console.log(e);
    ContextMenu.show(menulist);
};
