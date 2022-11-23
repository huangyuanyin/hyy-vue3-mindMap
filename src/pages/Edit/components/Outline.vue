<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <el-tree :data="data" :props="defaultProps" default-expand-all></el-tree>
  </Sidebar>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 大纲内容
 */
import { onMounted, ref, nextTick } from 'vue'
import Sidebar from './Sidebar'
import { mapState } from 'vuex'
import bus from '@/utils/bus.js'

const sidebar = ref(null)
const data = ref([])
const defaultProps = ref({
  label(data) {
    return data.data.text
  }
})

onMounted(() => {
  bus.on('data_change', data2 => {
    data.value = [data2]
  })
})
</script>

<script>
export default {
  name: 'Outline',
  computed: {
    ...mapState(['activeSidebar'])
  },

  watch: {
    activeSidebar(val) {
      if (val === 'outline') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
