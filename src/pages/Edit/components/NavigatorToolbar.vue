<template>
  <div class="navigatorContainer">
    <div class="item">
      <el-switch v-model="isReadonly" active-text="只读模式" inactive-text="编辑模式" @change="readonlyChange">
      </el-switch>
    </div>
    <div class="item">
      <Scale :mindMap="mindMap"></Scale>
    </div>
    <div class="item">
      <Fullscreen :mindMap="mindMap"></Fullscreen>
    </div>
  </div>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 导航器工具栏
*/
import { ref, defineProps } from "vue"
import Scale from "./Scale";
import Fullscreen from "./Fullscreen";

const props = defineProps({
  mindMap: {
    type: Object,
  },
})

const isReadonly = ref(false)

const readonlyChange = (value) => {
  props.mindMap.setMode(value ? 'readonly' : 'edit')
}

</script>

<script>
export default {
  name: "NavigatorToolbar",
};
</script>

<style lang="less" scoped>
.navigatorContainer {
  padding: 0 12px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 5px;
  opacity: 0.8;
  height: 44px;
  font-size: 12px;
  display: flex;
  align-items: center;

  .item {
    margin-right: 20px;

    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
