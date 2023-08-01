<template>
  <Sidebar ref="sidebar" :title="$t('strusture.title')">
    <div class="layoutList" :class="{ isDark: isDark }">
      <div
        class="layoutItem"
        v-for="item in layoutList"
        :key="item.value"
        @click="useLayout(item)"
        :class="{ active: item.value === layout }"
      >
        <div class="imgBox">
          <img :src="layoutImgMap[item.value]" alt="" />
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
import { toRaw, ref, onMounted, nextTick, watch, computed } from 'vue'
import Sidebar from './Sidebar'
import { layoutList } from 'simple-mind-map/src/constants/constant'
import { storeConfig } from '@/api'
import bus from '@/utils/bus.js'
import { mapState, useStore } from 'vuex'
import { layoutImgMap } from '@/config/constant.js'
/**
 * @Author: 黄原寅
 * @Desc: 结构
 */
const props = defineProps({
  mindMap: {
    type: Object
  }
})

const store = useStore()
const activeSidebar = computed(() => store.state.activeSidebar)
const isDark = computed(() => store.state.isDark)
const layout = ref('')
const sidebar = ref(null)

watch(
  () => activeSidebar.value,
  val => {
    if (val === 'structure') {
      layout.value = props.mindMap.getLayout()
      sidebar.value.show = true
    } else {
      sidebar.value.show = false
    }
  }
)

onMounted(() => {
  bus.on('showStructure', () => {
    sidebar.value.show = false
    nextTick(() => {
      layout.value = props.mindMap.getLayout()
      sidebar.value.show = true
    })
  })
})
/**
 * @Author: 黄原寅
 * @Desc: 使用主题
 */
const useLayout = layout => {
  layout.value = layout.value
  // this.mindMap.setLayout(layout.value);
  // 通过toRaw拿到mindMap的原始数据
  toRaw(props.mindMap).setLayout(layout.value)
  storeConfig({
    layout: layout.value
  })
}
</script>

<script>
export default {
  name: 'Structure'
}
</script>

<style lang="less" scoped>
.layoutList {
  padding: 20px;
  &.isDark {
    .name {
      color: #fff;
    }
  }
  .layoutItem {
    width: 100%;
    cursor: pointer;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;
    padding-bottom: 20px;
    transition: all 0.2s;
    border: 1px solid transparent;

    &:last-of-type {
      border: none;
    }

    &:hover {
      box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }

    &.active {
      border: 1px solid #67c23a;
    }

    .imgBox {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .name {
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
