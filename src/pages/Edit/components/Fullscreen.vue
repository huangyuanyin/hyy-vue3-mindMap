<template>
  <div class="fullscreenContainer">
    <el-tooltip class="item" effect="dark" content="全屏" placement="top">
      <div class="btn iconfont iconquanping" @click="toFullscreen"></div>
    </el-tooltip>
  </div>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 全屏
*/
import { defineProps, onMounted, watch } from "vue"
import { fullscrrenEvent, fullScreen } from "@/utils";

const props = defineProps({
  mindMap: {
    type: Object,
  },
})

watch(() => props.mindMap, (val, oldVal) => {
  if (val && !oldVal) { }
})

/**
 * @Author: 黄原寅
 * @Desc: 准备全屏
 */
const toFullscreen = () => {
  fullScreen(props.mindMap.el)
}

onMounted(() => {
  document[fullscrrenEvent] = (e) => {
    setTimeout(() => {
      props.mindMap.resize();
    }, 1000);
  };
})
</script>

<script>
export default {
  name: "Fullscreen",
};
</script>

<style lang="less" scoped>
.fullscreenContainer {
  display: flex;
  align-items: center;

  .btn {
    cursor: pointer;
  }
}
</style>
