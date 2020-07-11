# Html5 ContextMenu

> 一款简单好用的浏览器右键菜单构建JS库


### 功能介绍

- [X] 简单易用, 支持html5, vue, react, 等
- [X] 支持无限多级子菜单
- [X] 支持点击事件回调
- [X] 支持菜单选项禁用
- [X] 支持菜单选项图标
- [X] 支持快捷方式描述
- [X] 支持自动适应浏览器弹出位置(保持菜单全部可见在浏览器可见区域内)
- [X] 支持自动隐藏(点击菜单外部区域/调整浏览器窗口大小时/滚动页面/按下esc时)
- [X] 支持自定义css样式

### 兼容性


| 浏览器| Chrome | FireFox | IE | Safari |
|  ---- | ------ | ------- | --- | ----- |
|  版本  |        |         |  9+ |  11+  |


### 主题样式限制

- 属性限制
  - 内部使用`position:fixed`排版, 这会导致一些元素的某些样式会失效(如`.contextmenu`和`.contextmenu_item`的`margin`, 需要使用`padding`调整)
- 动画限制
  - `.contextmenu`不要使用`transition`动画属性, 这不仅可能会在加载过程看不到, 还会影响后续自动定位, 
  - `.contextmenu_item`不要使用会影响尺寸的动画, 如果使用了可能会引起排版紊乱, 因为菜单可见后已经的固定大小的了
  - 其他动画属性请自测

### 如何使用

- 集成

```shell
# npm
npm i contextmenu.ts
# yarn
yarn add contextmenu.ts
```

- 调试

```shell
yarn serve
```

- 构建

```shell
yarn build
```

### License

[LGPL-3.0](./license.txt)
