<template>
  <div class="countContainer">
    <div class="item">
      <span class="name">{{ $t('count.words') }}</span>
      <span class="value">{{ words }}</span>
    </div>
    <div class="item">
      <span class="name">{{ $t('count.nodes') }}</span>
      <span class="value">{{ num }}</span>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/bus.js'
/**
 * @Author: 黄原寅
 * @Desc: 字数及节点数量统计
 */
export default {
  name: 'Count',
  props: {},
  data() {
    return {
      words: 0,
      num: 0
    }
  },
  created() {
    bus.on('data_change', this.onDataChange)
  },
  beforeDestroy() {
    bus.off('data_change', this.onDataChange)
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 监听数据变化
     */
    onDataChange(data) {
      this.words = 0
      this.num = 0
      this.walk(data)
    },
    /**
     * @Author: 黄原寅
     * @Desc: 遍历
     */
    walk(data) {
      this.num++
      this.words += (String(data.data.text) || '').length
      if (data.children && data.children.length > 0) {
        data.children.forEach(item => {
          this.walk(item)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.countContainer {
  padding: 0 12px;
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 2px;
  opacity: 0.8;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  display: flex;

  .item {
    color: #555;
    margin-right: 15px;

    &:last-of-type {
      margin-right: 0;
    }

    .name {
      margin-right: 5px;
    }
  }
}
</style>
