<template>
  <Sidebar ref="sidebar" title="大纲">
    <el-tree :data="data" :props="defaultProps" default-expand-all></el-tree>
  </Sidebar>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 大纲内容
*/
import { onMounted, ref, nextTick } from 'vue'
import Sidebar from "./Sidebar";
import bus from "@/utils/bus.js"

const sidebar = ref(null)
const data = ref([])
const defaultProps = ref({
  label(data) {
    return data.data.text;
  }
})

onMounted(() => {
  bus.on("data_change", (data2) => {
    data.value = [data2];
  });
  bus.on("showOutline", () => {
    sidebar.value.show = false;
    nextTick(() => {
      sidebar.value.show = true;
    });
  });
})
</script>

<script>
export default {
  name: "Outline",
};
</script>

<style lang="less" scoped>

</style>
