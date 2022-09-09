<template>
  <Sidebar ref="sidebar" title="快捷键">
    <div class="box">
      <div v-for="item in shortcutKeyList" :key="item.type">
        <div class="title">{{ item.type }}</div>
        <div class="list" v-for="item2 in item.list" :key="item2.value">
          <div class="item">
            <span v-if="item2.icon" class="icon iconfont" :class="[item2.icon]"></span>
            <span class="name">{{ item2.name }}</span>
            <div class="value">{{ item2.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 快捷键功能
*/
import { ref, onMounted, nextTick } from 'vue'
import Sidebar from "./Sidebar"
import { shortcutKeyList } from "@/config"
import bus from "@/utils/bus.js"

const sidebar = ref(null) // 声明一个 ref 来存放该元素的引用   必须和模板里的 ref 同名

onMounted(() => {
  bus.on("showShortcutKey", () => {
    sidebar.value.show = false;
    nextTick(() => {
      sidebar.value.show = true;
    });
  });
})
</script>

<script>
export default {
  name: "ShortcutKey",
};
</script>

<style lang="less" scoped>
.box {
  padding: 0 20px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin: 26px 0 20px;
  }

  .list {
    font-size: 14px;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .icon {
        font-size: 16px;
        margin-right: 16px;
      }

      .name {
        color: #333;
      }

      .value {
        color: #909090;
        margin-left: auto;
      }
    }
  }
}
</style>
