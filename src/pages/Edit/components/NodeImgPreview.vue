<template>
  <viewer :images="images">
    <img v-for="src in images" :key="src" :src="src" />
  </viewer>
</template>

<script setup>
import { ref, defineProps, onMounted, onUnmounted, getCurrentInstance } from 'vue'
const props = defineProps({
  mindMap: {
    type: Object,
    default() {
      return null
    }
  }
})
const $viewerApi = getCurrentInstance().appContext.config.globalProperties.$viewerApi
const images = ref([])
onMounted(() => {
  props.mindMap.on('node_img_dblclick', onNodeTmgDblclick)
})
onUnmounted(() => {
  props.mindMap.off('node_img_dblclick', onNodeTmgDblclick)
})
const onNodeTmgDblclick = (node, e) => {
  e.stopPropagation()
  e.preventDefault()
  images.value = [node.nodeData.data.image]
  $viewerApi({
    images: images.value
  })
}
</script>

<style></style>
