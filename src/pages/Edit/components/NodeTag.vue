<template>
  <el-dialog custom-class="nodeTagDialog" v-model="dialogVisible" :title="$t('nodeTag.title')">
    <el-input
      v-model="tag"
      @keyup.native.enter="add"
      @keyup.native.stop
      @keydown.native.stop
      :disabled="tagArr.length >= max"
      :placeholder="$t('nodeTag.addTip')"
    >
    </el-input>
    <div class="tagList">
      <div
        class="tagItem"
        v-for="(item, index) in tagArr"
        :key="index"
        :style="{
          backgroundColor: generateColorByContent(item)
        }"
      >
        {{ item }}
        <div class="delBtn" @click="del(index)">
          <span class="iconfont iconshanchu"></span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 节点标签内容设置
 */
import { onBeforeMount, onMounted, ref } from 'vue'
import { generateColorByContent } from 'simple-mind-map/src/utils/index'
import bus from '@/utils/bus.js'

const dialogVisible = ref(false)
const tagArr = ref([])
const tag = ref('')
const activeNodes = ref([])
const max = ref(5)

onMounted(() => {
  bus.on('node_active', handleNodeActive)
  bus.on('showNodeTag', handleShowNodeTag)
})

onBeforeMount(() => {
  bus.off('node_active', handleNodeActive)
  bus.off('showNodeTag', handleShowNodeTag)
})

const handleNodeActive = args => {
  activeNodes.value = [...args[1]]
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0]
    tagArr.value = firstNode.getData('tag') || []
  } else {
    tagArr.value = []
    tag.value = ''
  }
}

const handleShowNodeTag = () => {
  bus.emit('startTextEdit')
  dialogVisible.value = true
}

/**
 * @Author: 黄原寅
 * @Desc: 添加
 */
const add = () => {
  tagArr.value.push(tag.value)
  tag.value = ''
}

/**
 * @Author: 黄原寅
 * @Desc: 删除
 */
const del = index => {
  tagArr.value.splice(index, 1)
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
  activeNodes.value.forEach(node => {
    node.setTag(tagArr.value)
  })
  cancel()
}
</script>

<script>
export default {
  name: 'NodeTag'
}
</script>

<style lang="less" scoped>
.nodeTagDialog {
  .tagList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;

    .tagItem {
      position: relative;
      padding: 3px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #fff;

      .delBtn {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        visibility: hidden;
      }

      &:hover {
        .delBtn {
          visibility: visible;
        }
      }
    }
  }
}
</style>
