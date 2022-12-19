# 一个简单&强大的Web思维导图

## 项目预览
![image](https://user-images.githubusercontent.com/42410679/208390574-d34f6b64-6570-4d33-87e8-9441da1126a5.png)
![image](https://user-images.githubusercontent.com/42410679/208390826-60ded4ce-ad48-46da-ab84-c66c3ef29885.png)
![image](https://user-images.githubusercontent.com/42410679/208390888-401d8c91-f76b-4c3b-a095-24daccae8404.png)



## 特性

- [x] 支持逻辑结构图、思维导图、组织结构图、目录组织图四种结构
- [x] 内置多种主题，允许高度自定义样式
- [x] 支持快捷键
- [x] 节点内容支持图片、图标、超链接、备注、标签、概要
- [x] 支持前进后退
- [x] 支持拖动、缩放
- [x] 支持右键按住多选
- [x] 支持节点自由拖拽、拖拽调整
- [x] 支持多种节点形状
- [x] 支持导出为`json`、`png`、`svg`、`pdf`，支持从`json`、`xmind`导入
- [x] 支持小地图

## 工具库介绍
1.`simple-mind-map`
思维导图工具库，框架无关，`Vue`、`React`等框架或无框架都可以使用。

2.使用`simple-mind-map`工具库，基于`vue2.x`、`ElementUI`搭建的在线思维导图。特性：

- [x] 工具栏，支持插入节点、删除节点；编辑节点图片、图标、超链接、备注、标签、概要

- [x] 侧边栏，基础样式设置面板、节点样式设置面板、大纲面板、主题选择面板、结构选择面板

- [x] 导入导出功能；数据默认保存在浏览器本地存储，也支持直接创建、打开、编辑电脑本地文件

- [x] 右键菜单，支持展开、收起、整理布局等操作

- [x] 底部栏，支持节点数量、字数统计；支持切换编辑和只读模式；支持放大缩小；支持全屏切换

## 开发

### 本地开发
```bash
git clone https://github.com/huangyuanyin/hyy-vue3-mindMap.git
npm i
npm run serve
```

# 特别说明

本项目较粗糙，未进行完整测试，功能尚不是很完善，性能也存在一些问题，仅用于学习和参考，请勿用于实际项目。

本项目基于https://github.com/wanglin2/mind-map 上重构vue3 + elementplus版本。

项目内置的主题和图标来自于：

[百度脑图](https://naotu.baidu.com/)

[知犀思维导图](https://www.zhixi.com/)
