<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <el-tree
      class="outlineTree"
      :class="{ isDark: isDark }"
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="false"
      default-expand-all
    >
      <template #default="{ node }">
        <span class="customNode" slot-scope="{ node, data }" @click="onClick($event, node)">
          <span
            class="nodeEdit"
            :key="getKey()"
            contenteditable="true"
            @keydown.stop="onKeydown($event, node)"
            @keyup.stop
            @blur="onBlur($event, node)"
            @paste="onPaste($event, node)"
            v-html="node.label"
          ></span>
        </span>
      </template>
    </el-tree>
  </Sidebar>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 大纲内容
 */
import { onMounted, ref, watch, computed } from 'vue'
import Sidebar from './Sidebar'
import { mapState, useStore } from 'vuex'
import { nodeRichTextToTextWithWrap, textToNodeRichTextWithWrap, getTextFromHtml } from 'simple-mind-map/src/utils'
import bus from '@/utils/bus.js'

const props = defineProps({
  mindMap: {
    type: Object
  }
})

const store = useStore()
const sidebar = ref(null)
const data = ref([])
const defaultProps = ref({
  label(data) {
    const text = (data.data.richText ? nodeRichTextToTextWithWrap(data.data.text) : data.data.text).replaceAll(/\n/g, '<br>')
    data.data.textCache = text
    return text
  }
})
const notHandleDataChange = ref(false)

const activeSidebar = computed(() => store.state.activeSidebar)
const isDark = computed(() => store.state.isDark)

watch(
  () => activeSidebar.value,
  val => {
    if (val === 'outline') {
      sidebar.value.show = true
    } else {
      sidebar.value.show = false
    }
  }
)

onMounted(() => {
  bus.on('data_change', data2 => {
    // 激活节点会让当前大纲失去焦点
    if (notHandleDataChange.value) {
      notHandleDataChange.value = false
      return
    }
    data.value = [props.mindMap.renderer.renderTree]
  })
})

const onBlur = (e, node) => {
  if (node.data.data.textCache === e.target.innerHTML) {
    return
  }
  delete node.data.data.textCache
  const richText = node.data.data.richText
  const text = richText ? e.target.innerHTML : e.target.innerText
  if (richText) {
    node.data._node.setText(textToNodeRichTextWithWrap(text), true, true)
  } else {
    node.data._node.setText(text)
  }
}

// 拦截粘贴事件
const onPaste = e => {
  e.preventDefault()
  const selection = window.getSelection()
  if (!selection.rangeCount) return
  selection.deleteFromDocument()
  let text = (e.clipboardData || window.clipboardData).getData('text')
  // 去除格式
  text = getTextFromHtml(text)
  // 去除换行
  text = text.replaceAll(/\n/g, '')
  const node = document.createTextNode(text)
  selection.getRangeAt(0).insertNode(node)
  selection.collapseToEnd()
}

const getKey = () => {
  return Math.random()
}

const onKeydown = (e, node) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    insertNode()
  }
  if (e.keyCode === 9) {
    e.preventDefault()
    insertChildNode()
  }
}

// 插入兄弟节点
const insertNode = () => {
  notHandleDataChange.value = false
  props.mindMap.execCommand('INSERT_NODE', false)
}

// 插入下级节点
const insertChildNode = () => {
  notHandleDataChange.value = false
  props.mindMap.execCommand('INSERT_CHILD_NODE', false)
}

// 激活当前节点且移动当前节点到画布中间
const onClick = (e, node) => {
  notHandleDataChange.value = true
  let targetNode = node.data._node
  if (targetNode && targetNode.nodeData.data.isActive) return
  props.mindMap.renderer.textEdit.stopFocusOnNodeActive()
  props.mindMap.execCommand('GO_TARGET_NODE', node.data.data.uid, () => {
    props.mindMap.renderer.textEdit.openFocusOnNodeActive()
  })
}
</script>

<style lang="less" scoped>
.customNode {
  width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
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
  .nodeEdit {
    outline: none;
  }
}
.outlineTree {
  &.isDark {
    background-color: #262a2e;
  }
  /deep/ .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }
  /deep/ .el-tree-node__content {
    height: auto;
    margin: 5px 0;
    .el-tree-node__expand-icon {
      color: #262a2e;
      &.is-leaf {
        color: transparent;
        position: relative;
        &::after {
          background-color: #262a2e;
          position: absolute;
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
