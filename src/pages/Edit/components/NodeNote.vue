<template>
  <el-dialog custom-class="nodeNoteDialog" v-model="dialogVisible" :title="$t('nodeNote.title')">
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 3, maxRows: 5 }"
      placeholder="请输入内容"
      v-model="note"
    >
    </el-input> -->
    <div class="noteEditor" ref="noteEditor" @keyup.stop @keydown.stop></div>
    <!-- <div class="tip">换行请使用：Enter+Shift</div> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeMount } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 节点备注内容设置
 */
const dialogVisible = ref(false)
const note = ref('')
const activeNodes = ref([])
const editor = ref(null)
const noteEditor = ref(null)

onMounted(() => {
  bus.on('node_active', handleNodeActive)
  bus.on('showNodeNote', handleShowNodeNote)
})

onBeforeMount(() => {
  bus.off('node_active', handleNodeActive)
  bus.off('showNodeNote', handleShowNodeNote)
})

const handleNodeActive = args => {
  activeNodes.value = [...args[1]]
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0]
    note.value = firstNode.getData('note') || ''
  } else {
    note.value = ''
  }
}

const handleShowNodeNote = () => {
  bus.emit('startTextEdit')
  dialogVisible.value = true
  nextTick(() => {
    initEditor()
  })
}

/**
 * @Author: 黄原寅
 * @Desc: 初始化编辑器
 */
const initEditor = () => {
  if (!editor.value) {
    editor.value = new Editor({
      el: noteEditor.value,
      height: '500px',
      initialEditType: 'markdown',
      previewStyle: 'vertical'
    })
  }
  editor.value.setMarkdown(note.value)
}

/**
 * @Author: 黄原寅
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false
  bus.emit('endTextEdit')
}

/**
 * @Author: 黄原寅
 * @Desc:  确定
 */
const confirm = () => {
  note.value = editor.value.getMarkdown()
  activeNodes.value.forEach(node => {
    node.setNote(note.value)
  })
  cancel()
}
</script>

<script>
export default {
  name: 'NodeNote'
}
</script>

<style lang="less" scoped>
.nodeNoteDialog {
  .tip {
    margin-top: 5px;
    color: #dcdfe6;
  }
}
</style>
