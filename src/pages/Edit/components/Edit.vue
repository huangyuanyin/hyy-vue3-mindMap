<template>
  <div class="editContainer">
    <div class="mindMapContainer" ref="mindMapContainer"></div>
    <Count v-if="!isZenMode"></Count>
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
import Color from './Color.vue'
import Vue from 'vue'
import router from '../../../router'
import store from '../../../store'
import i18n from '../../../i18n'
import Search from './Search.vue'
import NodeIconSidebar from './NodeIconSidebar.vue'
import NodeIconToolbar from './NodeIconToolbar.vue'
import OutlineEdit from './OutlineEdit.vue'

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
    OutlineEdit
  },
  data() {
    return {
      mindMapData: {},
      mindMap: null,
      prevImg: ''
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      openNodeRichText: state => state.localConfig.openNodeRichText,
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
    }
  },
  mounted() {
    // this.showNewFeatureInfo()
    this.init()
    bus.on('execCommand', this.execCommand)
    bus.on('paddingChange', this.onPaddingChange)
    bus.on('export', this.export)
    bus.on('setData', this.setData)
    bus.on('startTextEdit', () => {
      this.mindMap.renderer.startTextEdit()
    })
    bus.on('endTextEdit', () => {
      this.mindMap.renderer.endTextEdit()
    })
    bus.on('createAssociativeLine', () => {
      this.mindMap.associativeLine.createLineFromActiveNode()
    })
    bus.on('startPainter', () => {
      this.mindMap.painter.startPainter()
    })
    window.addEventListener('resize', () => {
      this.mindMap.resize()
    })
  },
  methods: {
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
        storeConfig({
          view: data
        })
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
      let { root, layout, theme, view, config } = this.getData()
      this.mindMap = new MindMap({
        el: this.$refs.mindMapContainer,
        data: root,
        layout: layout,
        theme: theme.template,
        themeConfig: theme.config,
        viewData: view,
        nodeTextEditZIndex: 1000,
        nodeNoteTooltipZIndex: 1000,
        customNoteContentShow: {
          show: (content, left, top) => {
            bus.emit('showNoteContent', [content, left, top])
          },
          hide: () => {
            // bus.emit('hideNoteContent')
          }
        },
        ...(config || {}),
        iconList: icon,
        useLeftKeySelectionRightKeyDrag: this.useLeftKeySelectionRightKeyDrag,
        customInnerElsAppendTo: null
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
        'painter_end'
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
      window.mindMap = this.mindMap
    },

    /**
     * @Author: 黄原寅
     * @Desc: 动态设置思维导图数据
     */
    setData(data) {
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
        this.mindMap.export(...args)
      } catch (error) {
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
