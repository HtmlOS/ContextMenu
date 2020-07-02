'use strict';

const div = document.getElementsByClassName('big')[0];
div.oncontextmenu = function (e) {
    console.log(e);
    ContextMenu.show(menulist);
};
