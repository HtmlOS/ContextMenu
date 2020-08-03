# Html5 ContextMenu

> A simple and easy-to-use contextmenu library for html5

[![npm](https://badgen.net/npm/v/@htmlos/contextmenu)](https://npm.im/@htmlos/contextmenu)

### Features

- [X] Supports  `html5`, `vue`, `react` and other frameworks
- [X] Support infinite submenu
- [X] Support menu item click event callback
- [X] Support menu item disabled
- [X] Support menu item icon
- [X] Support menu item hotkey description
- [X] Support auto fixed position (keep all menus visible in browser visible area)
- [X] Support auto hide (when clicking outside area of ​​menu/adjusting browser window size/scrolling page/pressing `ESC`)
- [X] Support custom css style & animation

![](./capture/capture1.gif)

### Browser Compatibility

| Browser | Chrome | FireFox | IE | Edge | Safari | Opera |
| ------- | ------ | ------- | -- | ---- | ------ | ----  |
| Version |   27   |    21   |  9 |  12  |   6    | 15    | 

### Usage

- Install

```shell
# npm
npm i @htmlos/contextmenu
# yarn
yarn add @htmlos/contextmenu
```

- Import

```js
import {ContextMenu, ContextMenuOptions} from "@htmlos/contextmenu";
import "@htmlos/contextmenu/dist/contextmenu.css";
```

- Custom style: please refer to `contextmenu.css`
  - Restrictions
    - Internally use `position: fixed`, which will cause some styles of some elements to be invalid (such as `.contextmenu` and `.contextmenu_item` of `margin`, need to use `padding` adjustment)
    - Don't use animation attribute for `.contextmenu`, this may not only be invisible during the loading process, but also affect the subsequent automatic positioning
    - Do not use animations that affect the size. If used, it may cause typographical disturbances, because the menu is already fixed size after being visible
    - Other attributes please test by yourself

- Config:

```js
// ContextMenu.config(options: CotextMenuOptions);
ContextMenu.config({
  i18n: function(s){
    return your_translate_function(s) || s;
  },
  style: {
      // custom animation: [string, number] => [className, duration],
      // defaults to [ "contextmenu-in", 0], [ "contextmenu-out", 0]
      contextmenuIn: ['fade-in', 200],
      contextmenuOut: ['fade-out', 200],
  },
});
```

- Show
  
```js
const menu=[
  { // item
    name: "reload",
    icon: "./reload.png",
    disabled: false,
    onlick: ()=>{},
    hotkey: "ctrl+r",
    children: [
      //...
    ]
  },
  {}, // divider
  //...
]

menu[0].children=menu; // nested infinite submenu

Contextmenu.show(menu);
```

- Hide

```js
// auto hide or manually
Contextmenu.hide();
```

### License

[MIT](./license.txt)
