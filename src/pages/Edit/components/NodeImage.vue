<template>
  <el-dialog custom-class="nodeDialog" v-model="dialogVisible" :title="$t('nodeImage.title')">
    <div class="title">方式一</div>
    <ImgUpload ref="ImgUploadRef" v-model="img" style="margin-bottom: 12px"></ImgUpload>
    <div class="title">方式二</div>
    <div class="inputBox">
      <span class="label">请输入图片地址</span>
      <el-input v-model="imgUrl" size="small" placeholder="http://xxx.com/xx.jpg"></el-input>
    </div>
    <div class="title">可选</div>
    <div class="inputBox">
      <span class="label">{{ $t('nodeImage.imgTitle') }}</span>
      <el-input v-model="imgTitle" size="small"></el-input>
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
import { onMounted, ref } from 'vue'
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
  bus.on('node_active', args => {
    activeNodes.value = args[1]
  })
  bus.on('showNodeImage', () => {
    reset()
    if (activeNodes.value.length > 0) {
      let firstNode = activeNodes.value[0]
      let img = firstNode.getData('image')
      console.log(`output->firstNode`, firstNode, img)
      if (img) {
        if (/^https?:\/\//.test(img)) {
          imgUrl.value = img
        } else {
          img.value = img
        }
      }
      imgTitle.value = firstNode.getData('imageTitle')
    }
    dialogVisible.value = true
  })
})

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
  try {
    if (!img.value && !imgUrl.value) return
    let res = null
    let img = ''
    if (img.value) {
      img = img.value
      res = await ImgUploadRef.value.getSize()
    } else if (imgUrl.value) {
      img = imgUrl.value
      res = await getImageSize(img)
    }
    activeNodes.value.forEach(node => {
      node.setImage({
        url: img || 'none',
        title: imgTitle.value,
        width: res.width,
        height: res.height
      })
    })
    cancel()
  } catch (error) {
    console.log(error)
  }
}
</script>

<script>
export default {
  name: 'NodeImage'
}
</script>

<style lang="less" scoped>
.nodeDialog {
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
