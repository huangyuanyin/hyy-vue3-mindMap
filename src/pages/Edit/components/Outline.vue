<template>
  <Sidebar ref="sidebar" title="大纲">
    <el-tree :data="data" :props="defaultProps" default-expand-all></el-tree>
  </Sidebar>
</template>

<script>
import Sidebar from "./Sidebar";
import bus from "@/utils/bus.js"
/**
 * @Author: 黄原寅
 * @Desc: 大纲内容
 */
export default {
  name: "Outline",
  components: {
    Sidebar,
  },
  data() {
    return {
      data: [],
      defaultProps: {
        label(data) {
          return data.data.text;
        },
      },
    };
  },
  created() {
    bus.on("data_change", (data) => {
      this.data = [data];
    });
    bus.on("showOutline", () => {
      this.$refs.sidebar.show = false;
      this.$nextTick(() => {
        this.$refs.sidebar.show = true;
      });
    });
  },
};
</script>

<style lang="less" scoped>

</style>
