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

### 演示

![alt capture1](./capture/capture1.gif)
### 兼容性


| 浏览器| Chrome | FireFox | IE | Safari |
|  ---- | ------ | ------- | --- | ----- |
|  版本  |        |         |  9+ |  11+  |


### 主题样式限制

- 使用position:fixed排版

   `注: 这可能会导致一些元素的某些样式会失效(如.contextmenu和.contextmenu_item的margin, 需要使用padding调整)`

- 不要使用会影响菜单大小的动画
  
  `菜单生成后是固定高宽, 如果使用了会影响菜单大小的动画(如放大), 可能会引起排版紊乱`

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
