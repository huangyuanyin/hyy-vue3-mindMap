<template>
  <div
    class="noteContentViewer"
    ref="noteContentViewer"
    :style="{
      left: this.left + 'px',
      top: this.top + 'px',
      visibility: show ? 'visible' : 'hidden'
    }"
    @click.stop
  ></div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 节点备注内容显示
 */
export default {
  name: 'NodeNoteContentShow',
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
      node: null
    }
  },
  created() {
    bus.on('showNoteContent', this.onShowNoteContent)
    bus.on('hideNoteContent', this.hideNoteContent)
    document.body.addEventListener('click', this.hideNoteContent)
    bus.on('node_active', this.hideNoteContent)
    bus.on('scale', this.onScale)
    bus.on('svg_mousedown', this.hideNoteContent)
  },
  beforeDestroy() {
    bus.off('showNoteContent', this.onShowNoteContent)
    bus.off('hideNoteContent', this.hideNoteContent)
    document.body.removeEventListener('click', this.hideNoteContent)
    bus.off('node_active', this.hideNoteContent)
    bus.off('scale', this.onScale)
    bus.off('svg_mousedown', this.hideNoteContent)
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 显示备注浮层
     */
    onShowNoteContent([content, left, top, node]) {
      this.node = node
      // mitt只支持传入一个参数
      this.editor.setMarkdown(content)
      this.updateNoteContentPosition(left, top)
      this.show = true
    },
    // 更新位置
    updateNoteContentPosition(left, top) {
      this.left = left
      this.top = top
    },
    // 画布缩放事件
    onScale() {
      if (!this.node || !this.show) return
      const { left, top } = this.node.getNoteContentPosition()
      this.updateNoteContentPosition(left, top)
    },
    /**
     * @Author: 黄原寅
     * @Desc: 隐藏备注浮层
     */
    hideNoteContent() {
      this.show = false
    },
    /**
     * @Author: 黄原寅
     * @Desc: 初始化编辑器
     */
    initEditor() {
      if (!this.editor) {
        this.editor = new Viewer({
          el: this.$refs.noteContentViewer
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: transparent;
    display: none;
  }
}
</style>
