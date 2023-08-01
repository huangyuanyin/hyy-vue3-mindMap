<template>
  <div class="fullscreenContainer" :class="{ isDark: isDark }">
    <el-tooltip class="item" effect="dark" :content="$t('fullscreen.fullscreenShow')" placement="top">
      <div class="btn iconfont iconquanping" @click="toFullscreenShow"></div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('fullscreen.fullscreenEdit')" placement="top">
      <div class="btn iconfont iconquanping1" @click="toFullscreenEdit"></div>
    </el-tooltip>
  </div>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 全屏
 */
import { defineProps, onMounted, watch } from 'vue'
import { fullscrrenEvent, fullScreen } from '@/utils'

const props = defineProps({
  mindMap: {
    type: Object
  },
  isDark: {
    type: Boolean
  }
})

watch(
  () => props.mindMap,
  (val, oldVal) => {
    if (val && !oldVal) {
    }
  }
)

// 全屏查看
const toFullscreenShow = () => {
  fullScreen(props.mindMap.el)
}

// 全屏编辑
const toFullscreenEdit = () => {
  fullScreen(document.body)
}

onMounted(() => {
  document[fullscrrenEvent] = e => {
    setTimeout(() => {
      props.mindMap.resize()
    }, 1000)
  }
})
</script>

<script>
export default {
  name: 'Fullscreen'
}
</script>

<style lang="less" scoped>
.fullscreenContainer {
  display: flex;
  align-items: center;
  &.isDark {
    .btn {
      color: hsla(0, 0%, 100%, 0.6);
    }
  }
  div:first-child {
    margin-right: 12px;
  }
  .btn {
    cursor: pointer;
  }
}
</style>
