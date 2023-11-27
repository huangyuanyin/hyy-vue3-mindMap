<template>
  <el-dialog custom-class="nodeHyperlinkDialog" v-model="dialogVisible" :title="$t('nodeHyperlink.title')">
    <div class="item">
      <span class="name">{{ $t('nodeHyperlink.link') }}</span>
      <el-input v-model="link" size="small" placeholder="http://xxxx.com/" @keyup.native.stop @keydown.native.stop @blur="handleUrl()">
        <template #prepend>
          <el-select v-model="protocol" slot="prepend" style="width: 80px">
            <el-option label="https" value="https"></el-option>
            <el-option label="http" value="http"></el-option>
            <el-option label="无" value="none"></el-option>
          </el-select>
        </template>
      </el-input>
    </div>
    <div class="item">
      <span class="name">{{ $t('nodeHyperlink.name') }}</span>
      <el-input v-model="linkTitle" size="small" @keyup.native.stop @keydown.native.stop></el-input>
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
import { ref, onMounted, onBeforeMount } from 'vue'
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 节点超链接内容设置
 */
const dialogVisible = ref(false)
const link = ref('')
const linkTitle = ref('')
const activeNodes = ref([])
const protocol = ref('https')

onMounted(() => {
  bus.on('node_active', handleNodeActive)
  bus.on('showNodeLink', handleShowNodeLink)
})

onBeforeMount(() => {
  bus.off('node_active', handleNodeActive)
  bus.off('showNodeLink', handleShowNodeLink)
})

const handleNodeActive = args => {
  activeNodes.value = [...args[1]]
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0]
    link.value = firstNode.getData('hyperlink') || ''
    handleUrl(true)
    linkTitle.value = firstNode.getData('hyperlinkTitle') || ''
  } else {
    link.value = ''
    linkTitle.value = ''
  }
}

const removeProtocol = url => {
  return url.replace(/^https?:\/\//, '')
}

const handleUrl = setProtocolNoneIfNotExist => {
  const res = link.value.match(/^(https?):\/\//)
  if (res && res[1]) {
    protocol.value = res[1]
  } else if (!link.value) {
    protocol.value = 'https'
  } else if (setProtocolNoneIfNotExist) {
    protocol.value = 'none'
  }
  link.value = removeProtocol(link.value)
}

const handleShowNodeLink = () => {
  activeNodes.value[0].mindMap.keyCommand.pause()
  bus.emit('startTextEdit')
  dialogVisible.value = true
}

/**
 * @Author: 黄原寅
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false
  activeNodes.value[0].mindMap.keyCommand.recovery()
  bus.emit('endTextEdit')
}

/**
 * @Author: 黄原寅
 * @Desc:  确定
 */
const confirm = () => {
  activeNodes.value.forEach(node => {
    if (!link.value.startsWith('http://') && !link.value.startsWith('https://') && !link.value.startsWith('//')) {
      link.value = `//${link.value}`
    }
    node.setHyperlink(link.value, linkTitle.value)
    node.setHyperlink((protocol.value === 'none' ? '' : protocol.value + '://') + link.value, linkTitle.value)
    cancel()
  })
}
</script>

<script>
export default {
  name: 'NodeHyperlink'
}
</script>

<style lang="less" scoped>
.nodeHyperlinkDialog {
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .name {
      display: block;
      width: 50px;
    }
  }
}
</style>
