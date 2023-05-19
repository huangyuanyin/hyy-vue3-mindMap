<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <el-tree class="outlineTree" :data="data" :props="defaultProps" :expand-on-click-node="false" default-expand-all>
      <template #default="{ node }">
        <span class="customNode" @click="onClick($event, node)">
          <span
            class="nodeEdit"
            :key="getKey()"
            contenteditable="true"
            @keydown.stop="onKeydown($event, node)"
            @keyup.stop
            @blur="onBlur($event, node)"
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
    return data.data.text.replaceAll(/\n/g, '</br>')
  }
})
const notHandleDataChange = ref(false)
const isCreateNode = ref(false)

const activeSidebar = computed(() => store.state.activeSidebar)

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
  if (isCreateNode.value) {
    isCreateNode.value = false
    return
  }
  node.data._node.setText(e.target.innerText)
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
  isCreateNode.value = true
  props.mindMap.execCommand('INSERT_NODE', false)
}

// 插入下级节点
const insertChildNode = () => {
  notHandleDataChange.value = false
  isCreateNode.value = true
  props.mindMap.execCommand('INSERT_CHILD_NODE', false)
}

// 激活当前节点且移动当前节点到画布中间
const onClick = (e, data) => {
  notHandleDataChange.value = true
  let node = data.data._node
  if (node.nodeData.data.isActive) return
  node.mindMap.renderer.moveNodeToCenter(node)
  node.active()
}
</script>

<style lang="less" scoped>
.customNode {
  width: 100%;
  overflow-x: auto;
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
  /deep/ .el-tree-node__content {
    height: auto;
    margin: 5px 0;
    .el-tree-node__expand-icon.is-leaf {
      position: relative;
      &::after {
        position: absolute;
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #c0c4cc;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
