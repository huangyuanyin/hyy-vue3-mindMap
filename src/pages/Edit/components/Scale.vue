<template>
  <div class="scaleContainer" :class="{ isDark: isDark }">
    <el-tooltip class="item" effect="dark" :content="$t('scale.zoomOut')" placement="top">
      <el-icon class="btn" @click="narrow">
        <Minus />
      </el-icon>
    </el-tooltip>
    <div class="scaleInfo">{{ scaleNum }}%</div>
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
    }
  }
  .btn {
    cursor: pointer;
  }

  .scaleInfo {
    width: 40px;
    text-align: center;
    margin: 0 5px;
  }
}
</style>
