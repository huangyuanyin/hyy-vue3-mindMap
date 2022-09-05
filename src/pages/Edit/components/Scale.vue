<template>
  <div class="scaleContainer">
    <el-tooltip class="item" effect="dark" content="缩小" placement="top">
      <el-icon class="btn" @click="narrow">
        <Minus />
      </el-icon>
    </el-tooltip>
    <div class="scaleInfo">{{ scaleNum }}%</div>
    <el-tooltip class="item" effect="dark" content="放大" placement="top">
      <el-icon class="btn" @click="enlarge">
        <Plus />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script>
import { Plus, Minus } from "@element-plus/icons-vue";

/**
 * @Author: 黄原寅
 * @Desc: 放大缩小
 */
export default {
  name: "Scale",
  components: {
    Plus, Minus
  },
  props: {
    mindMap: {
      type: Object,
    },
  },
  data() {
    return {
      scaleNum: 100,
    };
  },
  watch: {
    mindMap(val, oldVal) {
      if (val && !oldVal) {
        this.mindMap.on("scale", (scale) => {
          this.scaleNum = this.toPer(scale);
        });
        this.scaleNum = this.toPer(this.mindMap.view.scale)
      }
    },
  },
  methods: {
    /** 
     * @Author: 黄原寅 
     * @Desc: 转换成百分数 
     */
    toPer(scale) {
      return (scale * 100).toFixed(0)
    },

    /**
     * @Author: 黄原寅
     * @Desc: 缩小
     */
    narrow() {
      this.mindMap.view.narrow();
    },

    /**
     * @Author: 黄原寅
     * @Desc: 放大
     */
    enlarge() {
      this.mindMap.view.enlarge();
    },
  },
};
</script>

<style lang="less" scoped>
.scaleContainer {
  display: flex;
  align-items: center;

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
