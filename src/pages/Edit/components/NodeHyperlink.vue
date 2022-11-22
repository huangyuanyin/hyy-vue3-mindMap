<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" :title="$t('nodeHyperlink.title')">
    <div class="item">
      <span class="name">{{ $t('nodeHyperlink.link') }}</span>
      <el-input v-model="link" size="small" placeholder="http://xxxx.com/"></el-input>
    </div>
    <div class="item">
      <span class="name">{{ $t('nodeHyperlink.name') }}</span>
      <el-input v-model="linkTitle" size="small"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 节点超链接内容设置
 */
export default {
  name: 'NodeHyperlink',
  data() {
    return {
      dialogVisible: false,
      link: '',
      linkTitle: '',
      activeNodes: []
    }
  },
  created() {
    bus.on('node_active', args => {
      this.activeNodes = args[1]
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.link = firstNode.getData('hyperlink')
        this.linkTitle = firstNode.getData('hyperlinkTitle')
      } else {
        this.link = ''
        this.linkTitle = ''
      }
    })
    bus.on('showNodeLink', () => {
      this.activeNodes[0].mindMap.keyCommand.pause()
      bus.emit('startTextEdit')
      this.dialogVisible = true
    })
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 取消
     */
    cancel() {
      this.dialogVisible = false
      this.activeNodes[0].mindMap.keyCommand.recovery()
      bus.emit('endTextEdit')
    },

    /**
     * @Author: 黄原寅
     * @Desc:  确定
     */
    confirm() {
      this.activeNodes.forEach(node => {
        if (!this.link.startsWith('http://') && !this.link.startsWith('https://') && !this.link.startsWith('//')) {
          this.link = `//${this.link}`
        }
        node.setHyperlink(this.link, this.linkTitle)
        this.cancel()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.nodeDialog {
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
