<template>
  <el-dialog custom-class="nodeImageDialog" v-model="dialogVisible" :title="$t('nodeImage.title')">
    <div class="title">方式一</div>
    <ImgUpload ref="ImgUploadRef" @changeImg="onchange" :value="img" style="margin-bottom: 12px"></ImgUpload>
    <div class="title">方式二</div>
    <div class="inputBox">
      <span class="label">请输入图片地址</span>
      <el-input v-model="imgUrl" size="small" placeholder="http://xxx.com/xx.jpg" @keydown.native.stop></el-input>
    </div>
    <div class="title">可选</div>
    <div class="inputBox">
      <span class="label">{{ $t('nodeImage.imgTitle') }}</span>
      <el-input v-model="imgTitle" size="small" @keydown.native.stop></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('dialog.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * @Author: 黄原寅
 * @Desc: 节点图片内容设置
 */
import { onBeforeMount, onMounted, ref } from 'vue'
import ImgUpload from '@/components/ImgUpload'
import { getImageSize } from 'simple-mind-map/src/utils/index'
import bus from '@/utils/bus.js'

const dialogVisible = ref(false)
const img = ref('')
const imgUrl = ref('')
const imgTitle = ref('')
const activeNodes = ref(null)
const ImgUploadRef = ref(null)

onMounted(() => {
  bus.on('node_active', handleNodeActive)
  bus.on('showNodeImage', handleShowNodeImage)
})

onBeforeMount(() => {
  bus.off('node_active', handleNodeActive)
  bus.off('showNodeImage', handleShowNodeImage)
})

const handleNodeActive = args => {
  activeNodes.value = args[1]
}

const handleShowNodeImage = () => {
  reset()
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0]
    let imgSrc = firstNode.getData('image') || ''
    if (imgSrc) {
      if (/^https?:\/\//.test(imgSrc)) {
        imgUrl.value = imgSrc
      } else {
        img.value = imgSrc
      }
    }
    imgTitle.value = firstNode.getData('imageTitle') || ''
  }
  dialogVisible.value = true
}

const onchange = src => {
  img.value = src
}

/**
 * @Author: 黄原寅
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false
  img.value = ''
  reset()
}

const reset = () => {
  img.value = ''
  imgTitle.value = ''
  imgUrl.value = ''
}

/**
 * @Author: 黄原寅
 * @Desc:  确定
 */
const confirm = async () => {
  console.log(`output->img.value`, imgUrl.value)
  try {
    // 删除图片
    if (!img.value && !imgUrl.value) {
      cancel()
      activeNodes.value.forEach(node => {
        node.setImage(null)
      })
      return
    }
    let res = null
    let imgSrc = ''
    if (img.value) {
      imgSrc = img.value
      res = await ImgUploadRef.value.getSize()
    } else if (imgUrl.value) {
      imgSrc = imgUrl.value
      res = await getImageSize(imgSrc)
    }
    activeNodes.value.forEach(node => {
      node.setImage({
        url: imgSrc || 'none',
        title: imgTitle.value,
        width: res.width,
        height: res.height
      })
    })
    cancel()
  } catch (error) {
    console.log(`output->error`, error)
  }
}
</script>

<script>
export default {
  name: 'NodeImage'
}
</script>

<style lang="less" scoped>
.nodeImageDialog {
  .title {
    font-size: 18px;
    margin-bottom: 12px;
  }
  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
      width: 150px;
    }
  }
}
</style>
