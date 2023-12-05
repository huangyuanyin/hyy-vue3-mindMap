<template>
  <div class="scaleContainer" :class="{ isDark: isDark }">
    <el-tooltip class="item" effect="dark" :content="$t('scale.zoomOut')" placement="top">
      <el-icon class="btn" @click="narrow">
        <Minus />
      </el-icon>
    </el-tooltip>
    <div class="scaleInfo"><input type="text" v-model="scaleNum" @change="onScaleNumChange" @focus="onScaleNumInputFocus" />%</div>
    <el-tooltip class="item" effect="dark" :content="$t('scale.zoomIn')" placement="top">
      <el-icon class="btn" @click="enlarge">
        <Plus />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 放大缩小
 */
import { ref, defineProps, watch } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'

const props = defineProps({
  mindMap: {
    type: Object
  },
  isDark: {
    type: Boolean
  }
})

const scaleNum = ref(100)
const cacheScaleNum = ref(0)

watch(
  () => props.mindMap,
  (val, oldVal) => {
    if (val && !oldVal) {
      props.mindMap.on('scale', scale => {
        scaleNum.value = toPer(scale)
      })
      scaleNum.value = toPer(props.mindMap.view.scale)
    }
  }
)

/**
 * @Author: 黄原寅
 * @Desc: 转换成百分数
 */
const toPer = scale => {
  return (scale * 100).toFixed(0)
}

/**
 * @Author: 黄原寅
 * @Desc: 缩小
 */

const narrow = () => {
  props.mindMap.view.narrow()
}

/**
 * @Author: 黄原寅
 * @Desc: 放大
 */
const enlarge = () => {
  props.mindMap.view.enlarge()
}

// 聚焦时缓存当前缩放倍数
const onScaleNumInputFocus = () => {
  cacheScaleNum.value = scaleNum.value
}

// 手动输入缩放倍数
const onScaleNumChange = () => {
  const scaleNum2 = Number(scaleNum.value)
  if (Number.isNaN(scaleNum) || scaleNum2 <= 0) {
    scaleNum.value = this.cacheScaleNum
  } else {
    const cx = props.mindMap.width / 2
    const cy = props.mindMap.height / 2
    props.mindMap.view.setScale(scaleNum.value / 100, cx, cy)
  }
}
</script>

<script>
export default {
  name: 'Scale'
}
</script>

<style lang="less" scoped>
.scaleContainer {
  display: flex;
  align-items: center;
  &.isDark {
    .btn {
      color: hsla(0, 0%, 100%, 0.6);
    }
    .scaleInfo {
      color: hsla(0, 0%, 100%, 0.6);
      input {
        color: hsla(0, 0%, 100%, 0.6);
      }
    }
  }
  .btn {
    cursor: pointer;
  }

  .scaleInfo {
    margin: 0 5px;
    display: flex;
    align-items: center;
    input {
      width: 35px;
      text-align: center;
      background-color: transparent;
      border: none;
      outline: none;
    }
  }
}
</style>
