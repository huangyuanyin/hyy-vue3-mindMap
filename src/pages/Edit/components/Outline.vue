<template>
  <el-tree
    ref="tree"
    class="outlineTree"
    node-key="uid"
    draggable
    :class="{ isDark: isDark }"
    :data="data"
    :props="defaultProps"
    :highlight-current="true"
    :expand-on-click-node="false"
    default-expand-all
    :allow-drag="checkAllowDrag"
    @node-drop="onNodeDrop"
    @current-change="onCurrentChange"
    @mouseenter.native="isInTreArea = true"
    @mouseleave.native="isInTreArea = false"
  >
    <template #default="{ node, data }">
      <span class="customNode" :data-id="data.uid" @click="onClick(data)">
        <span
          class="nodeEdit"
          :contenteditable="!isReadonly"
          :key="getKey()"
          @keydown.stop="onNodeInputKeydown($event, node)"
          @keyup.stop
          @blur="onBlur($event, node)"
          @paste="onPaste($event, node)"
          v-html="node.label"
        ></span>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 大纲内容
 */
import { onMounted, ref, watch, computed, nextTick, onBeforeMount } from 'vue'
import { mapState, useStore } from 'vuex'
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  htmlEscape,
  handleInputPasteText
} from 'simple-mind-map/src/utils'
import bus from '@/utils/bus.js'

const props = defineProps({
  mindMap: {
    type: Object
  }
})

const store = useStore()
const tree = ref(null)
const sidebar = ref(null)
const data = ref([])
const defaultProps = ref({
  label: 'label'
})
const notHandleDataChange = ref(false)
const currentData = ref(null)
const isHandleNodeTreeRenderEnd = ref(false)
const beInsertNodeUid = ref('')
const insertType = ref('')
const isInTreArea = ref(false)
const isAfterCreateNewNode = ref(false)

const activeSidebar = computed(() => store.state.activeSidebar)
const isDark = computed(() => store.state.isDark)
const isReadonly = computed(() => store.state.isReadonly)
const isOutlineEdit = computed(() => store.state.isOutlineEdit)

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  refresh()
  bus.on('data_change', handleDataChange)
  bus.on('node_tree_render_end', handleNodeTreeRenderEnd2)
  bus.on('hide_text_edit', handleHideTextEdit)
})

onBeforeMount(() => {
  window.removeEventListener('keydown', onKeyDown)
  bus.off('data_change', handleDataChange)
  bus.off('node_tree_render_end', handleNodeTreeRenderEnd2)
  bus.off('hide_text_edit', handleHideTextEdit)
})

const handleHideTextEdit = () => {
  if (notHandleDataChange.value) {
    notHandleDataChange.value = false
    refresh()
  }
}

const handleDataChange = () => {
  // 在大纲里操作节点时不要响应该事件，否则会重新刷新树
  if (notHandleDataChange.value) {
    notHandleDataChange.value = false
    return
  }
  if (isAfterCreateNewNode.value) {
    isAfterCreateNewNode.value = false
    return
  }
  refresh()
}

const handleNodeTreeRenderEnd2 = () => {
  // 当前存在未完成的节点插入操作
  if (insertType.value) {
    // this[this.insertType]()
    insertType.value = ''
    return
  }
  // 插入了新节点后需要做一些操作
  if (isHandleNodeTreeRenderEnd.value) {
    isHandleNodeTreeRenderEnd.value = false
    refresh()
    nextTick(() => {
      afterCreateNewNode()
    })
  }
}

// 刷新树数据
const refresh = () => {
  data.value = props.mindMap.getData()
  data.value.root = true // 标记根节点
  let walk = root => {
    let text = (root.data.richText ? nodeRichTextToTextWithWrap(root.data.text) : root.data.text).replaceAll(/\n/g, '<br>')
    text = htmlEscape(text)
    root.textCache = text // 保存一份修改前的数据，用于对比是否修改了
    root.label = text
    root.uid = root.data.uid
    if (root.children && root.children.length > 0) {
      root.children.forEach(item => {
        walk(item)
      })
    }
  }
  walk(data.value)
  data.value = [data.value]
}

// 插入了新节点之后
const afterCreateNewNode = () => {
  // 如果是新插入节点，那么需要手动高亮该节点、定位该节点及聚焦
  let id = beInsertNodeUid.value
  if (id && tree.value) {
    try {
      isAfterCreateNewNode.value = true
      // 高亮树节点
      tree.value.setCurrentKey(id)
      let node = tree.value.getNode(id)
      onCurrentChange(node.data)
      // 定位该节点
      onClick(node.data)
      // 聚焦该树节点的编辑框
      const el = document.querySelector(`.customNode[data-id="${id}"] .nodeEdit`)
      if (el) {
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
        let offsetTop = el.offsetTop
        emit('scrollTo', offsetTop)
      }
    } catch (error) {
      console.log(error)
    }
  }
  beInsertNodeUid.value = ''
}

// 根节点不允许拖拽
const checkAllowDrag = node => {
  return !node.data.root
}

// 失去焦点更新节点文本
const onBlur = (e, node) => {
  // 节点数据没有修改
  if (node.data.textCache === e.target.innerHTML) {
    // 如果存在未执行的插入新节点操作，那么直接执行
    if (insertType.value) {
      // this[this.insertType]()
      insertType.value = ''
    }
    return
  }
  // 否则插入新节点操作需要等待当前修改事件渲染完成后再执行
  const richText = node.data.data.richText
  const text = richText ? e.target.innerHTML : e.target.innerText
  const targetNode = props.mindMap.renderer.findNodeByUid(node.data.uid)
  if (!targetNode) return
  notHandleDataChange.value = true
  if (richText) {
    targetNode.setText(textToNodeRichTextWithWrap(text), true, true)
  } else {
    targetNode.setText(text)
  }
}

// 拦截粘贴事件
const onPaste = e => {
  handleInputPasteText(e)
}

// 生成唯一的key
const getKey = () => {
  return Math.random()
}

// 节点输入区域按键事件
const onNodeInputKeydown = (e, node) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    insertType.value = insertNode
    e.target.blur()
  }
  if (e.keyCode === 9) {
    e.preventDefault()
    insertType.value = insertChildNode
    e.target.blur()
  }
}

// 插入兄弟节点
const insertNode = () => {
  notHandleDataChange.value = true
  isHandleNodeTreeRenderEnd.value = true
  beInsertNodeUid.value = createUid()
  props.mindMap.execCommand('INSERT_NODE', false, [], {
    uid: beInsertNodeUid.value
  })
}

// 插入下级节点
const insertChildNode = () => {
  notHandleDataChange.value = true
  isHandleNodeTreeRenderEnd.value = true
  beInsertNodeUid.value = createUid()
  props.mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
    uid: beInsertNodeUid.value
  })
}

// 激活当前节点且移动当前节点到画布中间
const onClick = data => {
  notHandleDataChange.value = true
  const targetNode = props.mindMap.renderer.findNodeByUid(data.uid)
  if (targetNode && targetNode.nodeData.data.isActive) return
  props.mindMap.execCommand('GO_TARGET_NODE', data.uid, () => {
    notHandleDataChange.value = false
  })
}

// 拖拽结束事件
const onNodeDrop = (data, target, postion) => {
  notHandleDataChange.value = true
  const node = props.mindMap.renderer.findNodeByUid(data.data.uid)
  const targetNode = props.mindMap.renderer.findNodeByUid(target.data.uid)
  if (!node || !targetNode) {
    return
  }
  switch (postion) {
    case 'before':
      props.mindMap.execCommand('INSERT_BEFORE', node, targetNode)
      break
    case 'after':
      props.mindMap.execCommand('INSERT_AFTER', node, targetNode)
      break
    case 'inner':
      props.mindMap.execCommand('MOVE_NODE_TO', node, targetNode)
      break
    default:
      break
  }
}

// 当前选中的树节点变化事件
const onCurrentChange = data => {
  currentData.value = data
}

// 删除节点
const onKeyDown = e => {
  if (!isInTreArea.value) return
  if ([46, 8].includes(e.keyCode) && currentData.value) {
    e.stopPropagation()
    props.mindMap.renderer.textEdit.hideEditTextBox()
    const node = props.mindMap.renderer.findNodeByUid(currentData.value.uid)
    if (node && !node.isRoot) {
      notHandleDataChange.value = true
      tree.value.remove(currentData.value)
      props.mindMap.execCommand('REMOVE_NODE', [node])
    }
  }
}
</script>

<style lang="less" scoped>
.customNode {
  width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  .nodeEdit {
    outline: none;
    white-space: normal;
    padding-right: 20px;
  }
}
.outlineTree {
  &.isDark {
    background-color: #262a2e;
    .customNode {
      color: #fff;
    }
    &.el-tree--highlight-current {
      /deep/ .el-tree-node.is-current > .el-tree-node__content {
        background-color: hsla(0, 0%, 100%, 0.05) !important;
      }
    }
    /deep/ .el-tree-node__content:hover,
    .el-upload-list__item:hover {
      background-color: hsla(0, 0%, 100%, 0.02) !important;
    }
    /deep/ .el-tree-node__content {
      .el-tree-node__expand-icon {
        color: #fff;
        &.is-leaf {
          &::after {
            background-color: #fff;
          }
        }
      }
    }
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
