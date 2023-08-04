# 一个基于Vue3.2 + ElementPlus的Web思维导图

## 项目预览
### 项目地址：[思维导图](https://huangyuanyin.gitee.io/hyy-vue3-mindmap/#/)
![image](https://github.com/huangyuanyin/hyy-vue3-mindMap/assets/42410679/de1f7a5c-b9a8-443c-ada7-ba85728f6760)
![image](https://github.com/huangyuanyin/hyy-vue3-mindMap/assets/42410679/ba50db92-df06-4ff0-8621-ab089c685fba)
![image](https://github.com/huangyuanyin/hyy-vue3-mindMap/assets/42410679/3fda4eb2-f473-40b3-afcd-bd10bbcee52c)




## 特性

- [x] 插件化架构，除核心功能外，其他功能作为插件提供，按需使用，减小整体体积
- [x] 支持逻辑结构图、思维导图、组织结构图、目录组织图、时间轴（横向、竖向）、鱼骨图等结构
- [x] 内置多种主题，允许高度自定义样式，支持注册新主题
- [x] 节点内容支持文本（普通文本、富文本）、图片、图标、超链接、备注、标签、概要
- [x] 支持画布拖动、缩放
- [x] 支持右键按住多选
- [x] 节点支持拖拽（拖拽移动、自由调整）、多种节点形状，支持使用 DDM 完全自定义节点内容
- [x] 支持鼠标按键拖动选择和Ctrl+左键两种多选节点方式
- [x] 支持导出为json、png、svg、pdf、markdown、xmind，支持从json、xmind、markdown导入
- [x] 支持快捷键、前进后退、关联线、搜索替换、小地图、水印
- [x] 提供丰富的配置，满足各种场景各种使用习惯

## 工具库介绍
1.`simple-mind-map`
思维导图工具库，框架无关，`Vue`、`React`等框架或无框架都可以使用。

2.使用`simple-mind-map`工具库，基于`vue3.2`、`ElementPlus`搭建的在线思维导图。特性：

- [x] 工具栏，支持插入节点、删除节点；编辑节点图片、图标、超链接、备注、标签、概要

- [x] 侧边栏，基础样式设置面板、节点样式设置面板、大纲面板、主题选择面板、结构选择面板

- [x] 导入导出功能；数据默认保存在浏览器本地存储，也支持直接创建、打开、编辑电脑本地文件

- [x] 右键菜单，支持展开、收起、整理布局等操作

- [x] 底部栏，支持节点数量、字数统计；支持切换编辑和只读模式；支持放大缩小；支持全屏切换；支持小地图

## 开发

### 本地开发
```bash
git clone https://github.com/huangyuanyin/hyy-vue3-mindMap.git
npm i
npm run serve
```

## 后期计划
- [ ] 将项目从 vue-cli 迁移至 vite
- [ ] 将项目由 JS 改至 TS编写

# 特别说明

本项目较粗糙，未进行完整测试，功能尚不是很完善，性能也存在一些问题，仅用于学习和参考，请勿用于实际项目。

本项目基于https://github.com/wanglin2/mind-map 上重构vue3 + elementplus版本。

项目内置的主题和图标来自于：

[百度脑图](https://naotu.baidu.com/)

[知犀思维导图](https://www.zhixi.com/)
