<template>
  <div class="editContainer">
    <div class="mindMapContainer" ref="mindMapContainer"></div>
    <Count :mindMap="mindMap" v-if="!isZenMode"></Count>
    <Navigator :mindMap="mindMap"></Navigator>
    <NavigatorToolbar :mindMap="mindMap" v-if="!isZenMode"></NavigatorToolbar>
    <OutlineSidebar :mindMap="mindMap"></OutlineSidebar>
    <Style v-if="!isZenMode"></Style>
    <BaseStyle :data="mindMapData" :mindMap="mindMap"></BaseStyle>
    <Theme v-if="mindMap" :mindMap="mindMap"></Theme>
    <Structure :mindMap="mindMap"></Structure>
    <ShortcutKey></ShortcutKey>
    <Contextmenu v-if="mindMap" :mindMap="mindMap"></Contextmenu>
    <RichTextToolbar v-if="mindMap" :mindMap="mindMap"></RichTextToolbar>
    <NodeNoteContentShow v-if="mindMap" :mindMap="mindMap"></NodeNoteContentShow>
    <NodeImgPreview v-if="mindMap" :mindMap="mindMap"></NodeImgPreview>
    <SidebarTrigger v-if="!isZenMode"></SidebarTrigger>
    <Search v-if="mindMap" :mindMap="mindMap"></Search>
    <NodeIconSidebar v-if="mindMap" :mindMap="mindMap"></NodeIconSidebar>
    <NodeIconToolbar v-if="mindMap" :mindMap="mindMap"></NodeIconToolbar>
    <OutlineEdit v-if="mindMap" :mindMap="mindMap"></OutlineEdit>
    <Scrollbar v-if="isShowScrollbar && mindMap" :mindMap="mindMap"></Scrollbar>
    <FormulaSidebar v-if="mindMap" :mindMap="mindMap"></FormulaSidebar>
  </div>
</template>

<script>
import { toRaw } from 'vue'
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'
import Watermark from 'simple-mind-map/src/plugins/Watermark.js'
import KeyboardNavigation from 'simple-mind-map/src/plugins/KeyboardNavigation.js'
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js'
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'
import SearchPlugin from 'simple-mind-map/src/plugins/Search.js'
import Painter from 'simple-mind-map/src/plugins/Painter.js'
import ScrollbarPlugin from 'simple-mind-map/src/plugins/Scrollbar.js'
import Formula from 'simple-mind-map/src/plugins/Formula.js'
import Cooperate from 'simple-mind-map/src/plugins/Cooperate.js'
import OutlineSidebar from './OutlineSidebar'
import Style from './Style'
import BaseStyle from './BaseStyle'
import Theme from './Theme'
import Structure from './Structure'
import Count from './Count'
import NavigatorToolbar from './NavigatorToolbar'
import ShortcutKey from './ShortcutKey'
import Contextmenu from './Contextmenu'
import RichTextToolbar from './RichTextToolbar'
import NodeNoteContentShow from './NodeNoteContentShow.vue'
import Navigator from './Navigator.vue'
import NodeImgPreview from './NodeImgPreview.vue'
import SidebarTrigger from './SidebarTrigger.vue'
import { getData, storeData, storeConfig } from '@/api'
import bus from '@/utils/bus.js'
import { mapState } from 'vuex'
import icon from '@/config/icon'
import customThemeList from '@/customThemes'
import CustomNodeContent from './CustomNodeContent.vue'
// import Color from './Color.vue'
import Vue from 'vue'
import router from '../../../router'
import store from '../../../store'
import i18n from '../../../i18n'
import Search from './Search.vue'
import NodeIconSidebar from './NodeIconSidebar.vue'
import NodeIconToolbar from './NodeIconToolbar.vue'
import OutlineEdit from './OutlineEdit.vue'
import { showLoading, hideLoading } from '@/utils/loading'
import handleClipboardText from '@/utils/handleClipboardText'
import Scrollbar from './Scrollbar.vue'
import exampleData from 'simple-mind-map/example/exampleData'
import FormulaSidebar from './FormulaSidebar.vue'

// 注册插件
MindMap.usePlugin(MiniMap)
  .usePlugin(Watermark)
  .usePlugin(Drag)
  .usePlugin(KeyboardNavigation)
  .usePlugin(ExportPDF)
  .usePlugin(ExportXMind)
  .usePlugin(Export)
  .usePlugin(Select)
  .usePlugin(AssociativeLine)
  .usePlugin(NodeImgAdjust)
  .usePlugin(TouchEvent)
  .usePlugin(SearchPlugin)
  .usePlugin(Painter)
  .usePlugin(Formula)
// .usePlugin(Cooperate)// 协同插件

// 注册自定义主题
customThemeList.forEach(item => {
  MindMap.defineTheme(item.value, item.theme)
})

/**
 * @Author: 黄原寅
 * @Desc: 编辑区域
 */
export default {
  name: 'Edit',
  components: {
    OutlineSidebar,
    Style,
    BaseStyle,
    Theme,
    Structure,
    Count,
    NavigatorToolbar,
    ShortcutKey,
    Contextmenu,
    RichTextToolbar,
    NodeNoteContentShow,
    Navigator,
    NodeImgPreview,
    SidebarTrigger,
    Search,
    NodeIconSidebar,
    NodeIconToolbar,
    OutlineEdit,
    Scrollbar,
    FormulaSidebar
  },
  data() {
    return {
      enableShowLoading: true,
      mindMapData: {},
      mindMap: null,
      prevImg: '',
      storeConfigTimer: null
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      openNodeRichText: state => state.localConfig.openNodeRichText,
      isShowScrollbar: state => state.localConfig.isShowScrollbar,
      useLeftKeySelectionRightKeyDrag: state => state.localConfig.useLeftKeySelectionRightKeyDrag
    })
  },
  watch: {
    openNodeRichText() {
      if (this.openNodeRichText) {
        this.addRichTextPlugin()
      } else {
        this.removeRichTextPlugin()
      }
    },
    isShowScrollbar() {
      if (this.isShowScrollbar) {
        this.addScrollbarPlugin()
      } else {
        this.removeScrollbarPlugin()
      }
    }
  },
  mounted() {
    showLoading()
    // this.showNewFeatureInfo()
    this.getData()
    this.init()
    bus.on('execCommand', this.execCommand)
    bus.on('paddingChange', this.onPaddingChange)
    bus.on('export', this.export)
    bus.on('setData', this.setData)
    bus.on('startTextEdit', this.handleStartTextEdit)
    bus.on('endTextEdit', this.handleEndTextEdit)
    bus.on('createAssociativeLine', this.handleCreateLineFromActiveNode)
    bus.on('startPainter', this.handleStartPainter)
    bus.on('node_tree_render_end', this.handleHideLoading)
    bus.on('showLoading', this.handleShowLoading)
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    bus.off('execCommand', this.execCommand)
    bus.off('paddingChange', this.onPaddingChange)
    bus.off('export', this.export)
    bus.off('setData', this.setData)
    bus.off('startTextEdit', this.handleStartTextEdit)
    bus.off('endTextEdit', this.handleEndTextEdit)
    bus.off('createAssociativeLine', this.handleCreateLineFromActiveNode)
    bus.off('startPainter', this.handleStartPainter)
    bus.off('node_tree_render_end', this.handleHideLoading)
    bus.off('showLoading', this.handleShowLoading)
    window.removeEventListener('resize', this.handleResize)
    this.mindMap.destroy()
  },
  methods: {
    handleStartTextEdit() {
      this.mindMap.renderer.startTextEdit()
    },

    handleEndTextEdit() {
      this.mindMap.renderer.endTextEdit()
    },

    handleCreateLineFromActiveNode() {
      this.mindMap.associativeLine.createLineFromActiveNode()
    },

    handleStartPainter() {
      this.mindMap.painter.startPainter()
    },

    handleResize() {
      this.mindMap.resize()
    },

    // 显示loading
    handleShowLoading() {
      this.enableShowLoading = true
      showLoading()
    },
    // 渲染结束后关闭loading
    handleHideLoading() {
      if (this.enableShowLoading) {
        this.enableShowLoading = false
        hideLoading()
      }
    },
    /**
     * @Author: 黄原寅
     * @Desc: 获取思维导图数据，实际应该调接口获取
     */
    getData() {
      const data = getData()
      this.mindMapData = data
      return data
    },

    // 通过toRaw方法拿到mindMap的原始数据
    // 解决vue3的mindMap变量被proxy代理了，mindMap变成Proxy里面有些动态的属性就不兼容了
    // 需要通过toRaw的形式，拿到mindMap的原始引用
    getMindMap() {
      return toRaw(this.mindMap)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 存储数据当数据有变时
     */
    bindSaveEvent() {
      bus.on('data_change', data => {
        storeData(data)
      })
      bus.on('view_data_change', data => {
        clearTimeout(this.storeConfigTimer)
        this.storeConfigTimer = setTimeout(() => {
          storeConfig({
            view: data
          })
        }, 300)
      })
    },

    /**
     * @Author: 黄原寅
     * @Desc: 手动保存
     */
    manualSave() {
      // let data = this.mindMap.command.getCopyData()
      // storeData(data)
      // let viewData = this.mindMap.view.getTransformData()
      // storeConfig({
      //   view: viewData,
      // })
      let data = this.mindMap.getData(true)
      storeConfig(data)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 初始化
     */
    init() {
      let hasFileURL = this.hasFileURL()
      let { root, layout, theme, view, config } = this.getData()
      // 如果url中存在要打开的文件，那么思维导图数据、主题、布局都使用默认的
      if (hasFileURL) {
        root = {
          data: {
            text: this.$t('edit.root')
          },
          children: []
        }
        layout = exampleData.layout
        theme = exampleData.theme
        view = null
      }
      this.mindMap = new MindMap({
        el: this.$refs.mindMapContainer,
        data: root,
        fit: false,
        layout: layout,
        theme: theme.template,
        themeConfig: theme.config,
        viewData: view,
        nodeTextEditZIndex: 1000,
        nodeNoteTooltipZIndex: 1000,
        customNoteContentShow: {
          show: (content, left, top, node) => {
            bus.emit('showNoteContent', [content, left, top, node])
          },
          hide: () => {
            // bus.emit('hideNoteContent')
          }
        },
        ...(config || {}),
        iconList: [...icon],
        useLeftKeySelectionRightKeyDrag: this.useLeftKeySelectionRightKeyDrag,
        customInnerElsAppendTo: null,
        enableAutoEnterTextEditWhenKeydown: true,
        customHandleClipboardText: handleClipboardText,
        defaultNodeImage: require('../../../assets/img/图片加载失败.svg'),
        initRootNodePosition: ['center', 'center'],
        handleIsSplitByWrapOnPasteCreateNewNode: () => {
          return this.$confirm(this.$t('edit.splitByWrap'), this.$t('edit.tip'), {
            confirmButtonText: this.$t('edit.yes'),
            cancelButtonText: this.$t('edit.no'),
            type: 'warning'
          })
        },
        errorHandler: (code, err) => {
          console.error(err)
          switch (code) {
            case 'export_error':
              this.$message.error('导出失败')
              break
            default:
              break
          }
        }
        // isUseCustomNodeContent: true,
        // 示例1：组件里用到了router、store、i18n等实例化vue组件时需要用到的东西
        // customCreateNodeContent: (node) => {
        //   let el = document.createElement('div')
        //   let Comp = Vue.extend(Color)
        //   let comp = new Comp({
        //     router,
        //     store,
        //     i18n
        //   })
        //   comp.$mount(el)
        //   return comp.$el
        // },
        // 示例2：组件里没有用到示例1的东西
        // customCreateNodeContent: (node) => {
        //   let el = document.createElement('div')
        //   let Comp = Vue.extend(CustomNodeContent)
        //   let comp = new Comp({
        //     propsData: {
        //       html: node.nodeData.data.text
        //     }
        //   })
        //   comp.$mount(el)
        //   return comp.$el
        // }
      })
      if (this.openNodeRichText) this.addRichTextPlugin()
      if (this.isShowScrollbar) this.addScrollbarPlugin()
      this.mindMap.keyCommand.addShortcut('Control+s', () => {
        this.manualSave()
      })
      // 转发事件
      ;[
        'node_active',
        'data_change',
        'view_data_change',
        'back_forward',
        'node_contextmenu',
        'node_click',
        'draw_click',
        'expand_btn_click',
        'svg_mousedown',
        'mouseup',
        'mode_change',
        'node_tree_render_end',
        'rich_text_selection_change',
        'transforming-dom-to-images',
        'generalization_node_contextmenu',
        'painter_start',
        'painter_end',
        'scrollbar_change',
        'scale'
      ].forEach(event => {
        this.getMindMap().on(event, (...args) => {
          if (['node_contextmenu', 'node_active', 'rich_text_selection_change'].includes(event)) {
            bus.emit(event, args)
          } else {
            bus.emit(event, ...args)
          }
        })
      })
      this.bindSaveEvent()
      this.testDynamicCreateNodes()
      // 解析url中的文件
      if (hasFileURL) {
        bus.emit('handle_file_url')
      }
      // 协同测试
      this.cooperateTest()
      window.mindMap = this.mindMap
      // 销毁
      // setTimeout(() => {
      //   console.log('销毁')
      //   this.mindMap.destroy()
      // }, 10000)
      // 测试
      // setTimeout(() => {
      //   console.log(this.mindMap.renderer.root.getRect())
      //   console.log(this.mindMap.renderer.root.getRectInSvg())
      // }, 5000);
    },

    // url中是否存在要打开的文件
    hasFileURL() {
      const fileURL = this.$route.query.fileURL
      if (!fileURL) return false
      return /\.(smm|json|xmind|md|xlsx)$/.test(fileURL)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 动态设置思维导图数据
     */
    setData(data) {
      this.handleShowLoading()
      // this.mindMap.setData(data)
      if (data.root) {
        this.getMindMap().setFullData(data)
      } else {
        this.getMindMap().setData(data)
      }
      this.mindMap.view.reset()
      this.manualSave()
    },

    /**
     * @Author: 黄原寅
     * @Desc: 重新渲染
     */
    reRender() {
      this.getMindMap().reRender()
    },

    /**
     * @Author: 黄原寅
     * @Desc: 执行命令
     */
    execCommand(args) {
      this.getMindMap().execCommand(...(Array.isArray(args) ? args : [args]))
    },

    /**
     * @Author: 黄原寅
     * @Desc: 导出
     */
    async export(args) {
      try {
        showLoading()
        await this.mindMap.export(...args)
        hideLoading()
      } catch (error) {
        hideLoading()
        console.log(error)
      }
    },

    /**
     * @Author: 黄原寅
     * @Desc: 修改导出内边距
     */
    onPaddingChange(data) {
      this.mindMap.updateConfig(data)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 显示新特性提示
     */
    showNewFeatureInfo() {
      let showed = localStorage.getItem('SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1')
      if (!showed) {
        this.$notify.info({
          title: this.$t('edit.newFeatureNoticeTitle'),
          message: this.$t('edit.newFeatureNoticeMessage'),
          duration: 0,
          onClose: () => {
            localStorage.setItem('SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1', true)
          }
        })
      }
    },

    /**
     * @Author: 黄原寅
     * @Desc: 加载节点富文本编辑插件
     */
    addRichTextPlugin() {
      if (!this.mindMap) return
      this.mindMap.addPlugin(RichText)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 移除节点富文本编辑插件
     */
    removeRichTextPlugin() {
      this.mindMap.removePlugin(RichText)
    },
    // 加载滚动条插件
    addScrollbarPlugin() {
      if (!this.mindMap) return
      this.mindMap.addPlugin(ScrollbarPlugin)
    },
    // 移除滚动条插件
    removeScrollbarPlugin() {
      this.mindMap.removePlugin(ScrollbarPlugin)
    },
    // 测试动态插入节点
    testDynamicCreateNodes() {
      // return
      setTimeout(() => {
        // 动态给指定节点添加子节点
        // this.mindMap.execCommand(
        //   'INSERT_CHILD_NODE',
        //   false,
        //   this.mindMap.renderer.root,
        //   {
        //     text: '自定义内容'
        //   },
        //   [
        //     {
        //       data: {
        //         text: '自定义子节点'
        //       }
        //     }
        //   ]
        // )
        // 动态给指定节点添加同级节点
        // this.mindMap.execCommand(
        //   'INSERT_NODE',
        //   false,
        //   null,
        //   {
        //     text: '自定义内容'
        //   },
        //   [
        //     {
        //       data: {
        //         text: '自定义同级节点'
        //       },
        //       children: [
        //         {
        //           data: {
        //             text: '自定义同级节点2'
        //           },
        //           children: []
        //         }
        //       ]
        //     }
        //   ]
        // )
        // 动态插入多个子节点
        // this.mindMap.execCommand('INSERT_MULTI_CHILD_NODE', null, [
        //   {
        //     data: {
        //       text: '自定义节点1'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点1-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   },
        //   {
        //     data: {
        //       text: '自定义节点2'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点2-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   }
        // ])
        // 动态插入多个同级节点
        // this.mindMap.execCommand('INSERT_MULTI_NODE', null, [
        //   {
        //     data: {
        //       text: '自定义节点1'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点1-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   },
        //   {
        //     data: {
        //       text: '自定义节点2'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点2-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   }
        // ])
        // 动态删除指定节点
        // this.mindMap.execCommand('REMOVE_NODE', this.mindMap.renderer.root.children[0])
      }, 5000)
    },

    // 协同测试
    cooperateTest() {
      if (this.mindMap.cooperate && this.$route.query.userName) {
        this.mindMap.cooperate.setProvider(null, {
          roomName: 'demo-room',
          signalingList: ['ws://192.168.3.125:4444']
        })
        this.mindMap.cooperate.setUserInfo({
          id: Math.random(),
          name: this.$route.query.userName,
          color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'][Math.floor(Math.random() * 5)],
          avatar:
            Math.random() > 0.5
              ? 'https://img0.baidu.com/it/u=4270674549,2416627993&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1696006800&t=4d32871d14a7224a4591d0c3c7a97311'
              : ''
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editContainer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .mindMapContainer {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
