<template>
  <div class="fullscreenContainer">
    <el-tooltip class="item" effect="dark" content="全屏" placement="top">
      <div class="btn iconfont iconquanping" @click="toFullscreen"></div>
    </el-tooltip>
  </div>
</template>

<script>
import { fullscrrenEvent, fullScreen } from "@/utils";

/**
 * @Author: 黄原寅
 * @Desc: 全屏
 */
export default {
  name: "Fullscreen",
  props: {
    mindMap: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {
    mindMap(val, oldVal) {
      if (val && !oldVal) {
      }
    },
  },
  created() {
    document[fullscrrenEvent] = (e) => {
      setTimeout(() => {
        this.mindMap.resize();
      }, 1000);
    };
  },
  methods: {
    /**
     * @Author: 黄原寅
     * @Desc: 准备全屏
     */
    toFullscreen() {
      fullScreen(this.mindMap.el);
    },
  },
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
