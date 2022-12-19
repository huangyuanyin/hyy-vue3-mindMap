<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <el-tree class="outlineTree" :data="data" :props="defaultProps" :expand-on-click-node="false" default-expand-all>
      <template #default="{ node, data }">
        <span class="customNode">
          <span
            class="nodeEdit"
            :key="getKey()"
            contenteditable="true"
            @keydown.stop
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
import { onMounted, ref, defineProps, nextTick } from 'vue'
import Sidebar from './Sidebar'
import { mapState } from 'vuex'
import bus from '@/utils/bus.js'

const props = defineProps({
  mindMap: {
    type: Object
  }
})
const sidebar = ref(null)
const data = ref([])
const defaultProps = ref({
  label(data) {
    return data.data.text.replaceAll(/\n/g, '</br>')
  }
})

onMounted(() => {
  console.log('props.mindMap', props.mindMap)
  bus.on('data_change', data2 => {
    data.value = [props.mindMap.renderer.renderTree]
  })
})

const onBlur = (e, node) => {
  node.data._node.setText(e.target.innerText)
}

const getKey = () => {
  return Math.random()
}
</script>

<script>
export default {
  name: 'Outline',
  computed: {
    ...mapState(['activeSidebar'])
  },

  watch: {
    activeSidebar(val) {
      if (val === 'outline') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  }
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
