<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" :title="$t('nodeNote.title')">
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 3, maxRows: 5 }"
      placeholder="请输入内容"
      v-model="note"
    >
    </el-input> -->
    <div class="noteEditor" ref="noteEditor"></div>
    <!-- <div class="tip">换行请使用：Enter+Shift</div> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 节点备注内容设置
 */
export default {
  name: 'NodeNote',
  data() {
    return {
      dialogVisible: false,
      note: '',
      activeNodes: [],
      editor: null
    }
  },
  created() {
    bus.on('node_active', args => {
      this.activeNodes = args[1]
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.note = firstNode.getData('note')
      } else {
        this.note = ''
      }
    })
    bus.on('showNodeNote', () => {
      bus.emit('startTextEdit')
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    })
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 初始化编辑器
     */
    initEditor() {
      if (!this.editor) {
        this.editor = new Editor({
          el: this.$refs.noteEditor,
          height: '500px',
          initialEditType: 'markdown',
          previewStyle: 'vertical'
        })
      }
      this.editor.setMarkdown(this.note)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 取消
     */
    cancel() {
      this.dialogVisible = false
      bus.emit('endTextEdit')
    },

    /**
     * @Author: 黄原寅
     * @Desc:  确定
     */
    confirm() {
      this.note = this.editor.getMarkdown()
      this.activeNodes.forEach(node => {
        node.setNote(this.note)
      })
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
.nodeDialog {
  .tip {
    margin-top: 5px;
    color: #dcdfe6;
  }
}
</style>
